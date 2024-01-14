import { AuthProvider } from '@daita/http-interface';

export interface HttpAdapterOptions {
  baseUrl: string;
  auth: AuthProvider | null | undefined;
}
