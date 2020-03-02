import {UsernamePasswordAuthProvider} from './username-password-auth-provider';
import {TokenAuthProvider} from './token-auth-provider';

export type AuthProvider = UsernamePasswordAuthProvider | TokenAuthProvider;