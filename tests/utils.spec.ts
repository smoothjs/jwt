import test from 'japa'
import { getSecretOrPrivateKey, getSecretOrPublicKey } from '../src/utils'
import { Config } from '@smoothjs/config'
import { Container } from 'typescript-ioc'

test.group('getSecretOrPrivateKey | without secretEncoding', (group) => {
  let config: Config

  group.beforeEach(() => {
    config = new Config()

    config.set('jwt.secret', 'secret')
    config.set('jwt.secretEncoding', false)

    Container.bind(Config).factory(() => config)
  })

  group.afterEach(() => {
    config.remove('jwt.secret')
    config.remove('jwt.secretEncoding')
  })

  test('return the secret', async (assert) => {
    assert.equal(getSecretOrPrivateKey(), 'secret')
  })
})

test.group('getSecretOrPrivateKey | with secretEncoding', (group) => {
  let config: Config

  group.beforeEach(() => {
    config = new Config()

    config.set('jwt.secret', 'secret')
    config.set('jwt.secretEncoding', 'base64')

    Container.bind(Config).factory(() => config)
  })

  group.afterEach(() => {
    config.remove('jwt.secret')
    config.remove('jwt.secretEncoding')
  })

  test('return the secret', async (assert) => {
    assert.deepEqual(getSecretOrPrivateKey(), Buffer.from('secret', 'base64'))
  })
})

test.group('getSecretOrPrivateKey | throw an Error', (group) => {
  test('throw an error', async (assert) => {
    try {
      getSecretOrPrivateKey()
    } catch (error) {
      assert.equal(
        error.message,
        '[CONFIG] You must provide at least one of these configuration keys: jwt.secret or jwt.privateKey.'
      )
    }
  })
})

test.group('getSecretOrPublicKey | with secretEncoding', (group) => {
  let config: Config

  group.beforeEach(() => {
    config = new Config()

    config.set('jwt.secret', 'secret')
    config.set('jwt.secretEncoding', false)

    Container.bind(Config).factory(() => config)
  })

  group.afterEach(() => {
    config.remove('jwt.secret')
    config.remove('jwt.secretEncoding')
  })

  test('return public key value', async (assert) => {
    assert.equal(getSecretOrPublicKey(), 'secret')
  })
})

test.group('getSecretOrPrivateKey | with secretEncoding', (group) => {
  let config: Config

  group.beforeEach(() => {
    config = new Config()

    config.set('jwt.secret', 'secret')
    config.set('jwt.secretEncoding', 'base64')

    Container.bind(Config).factory(() => config)
  })

  group.afterEach(() => {
    config.remove('jwt.secret')
    config.remove('jwt.secretEncoding')
  })

  test('return the secret', async (assert) => {
    assert.deepEqual(getSecretOrPublicKey(), Buffer.from('secret', 'base64'))
  })
})

test.group('getSecretOrPublicKey | throw an Error', (group) => {
  test('throw an error', async (assert) => {
    try {
      getSecretOrPublicKey()
    } catch (error) {
      assert.equal(
        error.message,
        '[CONFIG] You must provide at least one of these configuration keys: jwt.secret or jwt.publicKey.'
      )
    }
  })
})
