export interface Http {
  json<T>(options: HttpRequestOptions): Promise<HttpSendResult>;
  formData(options: HttpRequestOptions): Promise<HttpSendResult>;
}

export interface HttpRequestOptions {
  path: string;
  data?: any;
  headers?: { [key: string]: string };
  query?: { [key: string]: string };
  authorized?: boolean;
}

export interface HttpSendResult {
  data: any;
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
