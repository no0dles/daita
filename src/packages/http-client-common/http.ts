export interface Http {
  sendJson<T>(url: string, data?: any, query?: { [key: string]: string }): Promise<HttpSendResult>;
  sendFormData(url: string, data: any): Promise<HttpSendResult>;
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
