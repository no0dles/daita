import axios, {AxiosRequestConfig} from 'axios';
import {AuthProvider, isTokenAuthProvider} from '../http-client-common/auth';
import {failNever} from '../common/utils';

export class HttpBase {
  constructor(protected baseUrl: string,
              protected authProvider: AuthProvider | null | undefined) {
  }

  protected async send<T>(url: string, data?: any, query?: { [key: string]: string }) {
    try {
      const qs = query ? Object.keys(query).map(key => `${key}=${query[key]}`).join('&') : '';
      const reqUrl = `${this.baseUrl}/api/relational/${url}${qs.length > 0 ? '?' + qs : ''}`;
      const config: AxiosRequestConfig = {};
      if (this.authProvider) {
        const authProvider = this.authProvider;
        if (isTokenAuthProvider(authProvider)) {
          const token = await authProvider.getToken();
          if (token) {
            config.headers = {'Authorization': `Bearer ${token}`};
          }
        } else {
          failNever(authProvider, 'unknown auth provider');
        }
      }
      return await axios.post(reqUrl, data, config);
    } catch (e) {
      if (e.response && e.response.status === 500) {
        throw new Error(e.response.data.message);
      }
      throw e;
    }
  }
}
