import {isKind} from '@daita/common';

export interface TokenAuthProvider {
  getToken(): Promise<string | null>;
}

export const isTokenAuthProvider = (val: any): val is TokenAuthProvider => isKind(val, ['getToken']);
