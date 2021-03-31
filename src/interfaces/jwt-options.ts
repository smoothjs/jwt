export interface JWTOptions {
    user?: (id: string|number) => Promise<any|undefined>;
    secretOrPublicKey?: (header: any, payload: any) => Promise<string>;
    blackList?: (token: string) => boolean|Promise<boolean>;
    csrf?: boolean;
}