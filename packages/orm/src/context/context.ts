import { ContextAuthorization } from './context-authorization';

export interface Context<T> {
  authorize(auth: ContextAuthorization): void;
}
