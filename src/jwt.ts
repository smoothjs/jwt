import { Hook, UnauthorizedException, isString } from '@smoothjs/smooth'
import { JWTOptions, VerifyOptions } from "./interfaces"
import { decode, verify } from 'jsonwebtoken';
import { isInvalidTokenError, getSecretOrPublicKey } from './utils';

export function JWT(
    required: boolean,
    options: JWTOptions,
    verifyOptions: VerifyOptions
): MethodDecorator & ClassDecorator {
    return Hook(async (
        request: any,
        response: any,
        next: Function
    ) => {
        const authorizationHeader = request.get('Authorization') || ''

        if (!authorizationHeader) {
            if (!required) {
              next()
              return
            }
            next(new UnauthorizedException('Authorization header not found.'))
            return
        }

        const content = authorizationHeader.split('Bearer ')[1] as string|undefined;
        if (!content) {
          throw new UnauthorizedException('Expected a bearer token. Scheme is Authorization: Bearer <token>.');
        }

        if (options.blackList && await options.blackList(content)) {
            next(new UnauthorizedException('JWT token revoked'))
            return
        }

        const parts = content.split('.');

        if (parts.length !== 3) {
            next(new UnauthorizedException('JWT token malformed'))
            return
        }

        let decoded: null | { header: any, payload: any };

        try {
            decoded = decode(content, { complete: true }) as null | { header: any, payload: any };
        } catch (error) {
            next(new UnauthorizedException(error.message))
            return
        }

        if (!decoded) {
            next(new UnauthorizedException('Invalid JWT token'))
            return
        }

        let secretOrPublicKey: string | Buffer;
        if (options.secretOrPublicKey) {
          try {
            secretOrPublicKey = await options.secretOrPublicKey(decoded.header, decoded.payload);
          } catch (error) {
            if (isInvalidTokenError(error)) {
              next(new UnauthorizedException(error.message))
              return
            }
            next(error);
            return
          }
        } else {
          secretOrPublicKey = getSecretOrPublicKey();
        }

        let payload: any;
        try {
          payload = await new Promise((resolve, reject) => {
            verify(content, secretOrPublicKey, verifyOptions, (err: any, value: object | undefined) => {
              if (err) { reject(err); } else { resolve(value); }
            });
          });
        } catch (error) {
          next(new UnauthorizedException(error.message))
          return
        }

        if (!options.user) {
            request.user = payload;

            next()
            return;
          }
      
        if (! isString(payload.sub)) {
            next(new UnauthorizedException('The token must include a subject which is the id of the user.'));
            return
        }
      
        const user = await options.user(payload.sub);
        if (!user) {
            next(new UnauthorizedException('The token subject does not match any user.'))
            return
        }
      
        request.user = user;
    })
}