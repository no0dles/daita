export interface Http {
  json<T>(options: HttpRequestPostOptions): Promise<HttpSendResult<T>>;
  formData(options: HttpRequestPostOptions): Promise<HttpSendResult>;
  get<T>(options: HttpRequestGetOptions): Promise<HttpSendResult<T>>;
}

export interface HttpRequestGetOptions {
  path: string;
  headers?: { [key: string]: string };
  query?: { [key: string]: string };
  authorized?: boolean;
}

export interface HttpRequestPostOptions extends HttpRequestGetOptions {
  data?: any;
}

export interface HttpSendResult<T = any> {
  data: T;
  statusCode: number;
  headers: { 'x-transaction-timeout'?: number };
}

export function encodeFormData(data: any) {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&');
}

export function getQueryString(query: any): string {
  return query
    ? Object.keys(query)
        .map((key) => `${key}=${query[key]}`)
        .join('&')
    : '';
}

export function getUri(baseUrl: string, path: string, qs?: string) {
  return `${baseUrl}${baseUrl.endsWith('/') ? '' : '/'}${path.startsWith('/') ? path.substr(1) : path}${
    qs && qs.length > 0 ? '?' + qs : ''
  }`;
}
