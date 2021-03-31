import { JWTOptions, VerifyOptions } from "./interfaces";
import { JWT } from "./jwt";

export function JWTRequired(options: JWTOptions = {}, verifyOptions: VerifyOptions = {}): ClassDecorator & MethodDecorator {
    return JWT(true, options, verifyOptions);
}