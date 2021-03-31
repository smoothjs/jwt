import { sign } from "jsonwebtoken";
import { getSecretOrPrivateKey } from "./utils";

export class JWTServiceManager {
    public make(
        data: object,
        options?: object
    ) {
        return sign(
            data,
            getSecretOrPrivateKey(),
            options ? options : {
                expiresIn: '7H'
            }
        )
    }
}