import {isKind} from '@daita/common';

export type SocketAuthEvent = SocketUserPassAuthEvent | SocketTokenAuthEvent;

export interface SocketTokenAuthEvent {
  token: string;
}

export interface SocketUserPassAuthEvent {
  username: string;
  password: string;
}

export const isSocketTokenAuthEvent = (val: any): val is SocketTokenAuthEvent => isKind(val, ['token']);
export const isSocketUserPassAuthEvent = (val: any): val is SocketUserPassAuthEvent => isKind(val, ['username', 'password']);
