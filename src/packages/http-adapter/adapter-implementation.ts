import { AuthProvider } from '../http-client-common/auth-provider';

export interface HttpAdapterOptions {
  baseUrl: string;
  authProvider: AuthProvider | null | undefined;
}
