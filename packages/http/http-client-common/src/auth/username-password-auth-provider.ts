import {isKind} from '@daita/common';

export interface UsernamePasswordAuthProvider {
  username: string;
  password: string;
}

export const isUsernamePasswordAuthProvider = (val: any): val is UsernamePasswordAuthProvider => isKind(val, ['username', 'password']);
