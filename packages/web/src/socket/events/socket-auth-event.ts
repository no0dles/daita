export type SocketAuthEvent = {
  kind: 'token';
  token: string;
} | { kind: 'userpass', username: string, password: string };