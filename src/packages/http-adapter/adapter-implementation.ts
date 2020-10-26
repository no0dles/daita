import { AuthProvider } from '../http-client-common/auth';

export interface HttpAdapterOptions {
  baseUrl: string;
  authProvider: AuthProvider | null | undefined;
}
