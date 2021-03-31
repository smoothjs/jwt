import { Container } from 'typescript-ioc'
import { JWTServiceManager } from './jwt-service-manager'

export class JWTModule {
  static fire() {
    Container.bind(JWTServiceManager).factory(() => new JWTServiceManager())
  }
}
