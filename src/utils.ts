import { Config } from '@smoothjs/config'
import { UnauthorizedException } from '@smoothjs/smooth'
import { Container } from 'typescript-ioc'

export function isInvalidTokenError(obj: any): obj is UnauthorizedException {
  return (
    obj instanceof UnauthorizedException ||
    (typeof obj === 'object' && obj !== null && obj.isInvalidTokenError === true)
  )
}

export function getSecretOrPublicKey(): string | Buffer {
  const config = Container.get(Config)

  const secret = config.get('jwt.secret', false)
  if (secret) {
    const secretEncoding = config.get('jwt.secretEncoding', 'utf8')
    if (secretEncoding) {
      return Buffer.from(secret, secretEncoding)
    }
    return secret
  }

  const publicKey = config.get('jwt.publicKey', false)
  if (publicKey) {
    return publicKey
  }

  throw new Error(
    '[CONFIG] You must provide at least one of these configuration keys: jwt.secret or jwt.publicKey.'
  )
}

export function getSecretOrPrivateKey(): string | Buffer {
  const config = Container.get(Config)

  const secret = config.get('jwt.secret', false)
  if (secret) {
    const secretEncoding = config.get('jwt.secretEncoding', 'utf8')
    if (secretEncoding) {
      return Buffer.from(secret, secretEncoding)
    }
    return secret
  }

  const privateKey = config.get('jwt.privateKey', false)
  if (privateKey) {
    return privateKey
  }

  throw new Error(
    '[CONFIG] You must provide at least one of these configuration keys: jwt.secret or jwt.privateKey.'
  )
}
