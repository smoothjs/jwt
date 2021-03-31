import { JWTOptions, VerifyOptions } from './interfaces'
import { JWT } from './jwt'

export function JWTOptional(
  options: JWTOptions = {},
  verifyOptions: VerifyOptions = {}
): ClassDecorator & MethodDecorator {
  return JWT(false, options, verifyOptions)
}
