import { ClientTestContext } from './client-test-context';

export interface ClientTestFactory {
  getClient(): Promise<ClientTestContext>;
}
