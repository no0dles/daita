import { AuthProvider } from '@daita/http';

export interface HttpAdapterOptions {
  baseUrl: string;
  auth: AuthProvider | null | undefined;
}
