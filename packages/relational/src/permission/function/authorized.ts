import { AuthDescription } from '../description/auth-description';

export function authorized(): AuthDescription {
  return {
    type: 'authorized',
  };
}
