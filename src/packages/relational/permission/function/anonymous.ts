import { AuthDescription } from '../description/auth-description';

export function anonymous(): AuthDescription {
  return {
    type: 'anonymous',
  };
}


