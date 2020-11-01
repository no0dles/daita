import { AuthRoleDescription } from '../description/auth-role-description';

export function role(role: string): AuthRoleDescription {
  return {
    type: 'role',
    role,
  };
}
