export class UserPool {
  static table = 'UserPool';
  static schema = 'daita';

  id!: string;
  name!: string;
  allowRegistration?: boolean;

  algorithm!: UserPoolAlgorithm;

  accessTokenExpiresIn!: number;
  refreshRefreshExpiresIn!: number;

  emailVerifyExpiresIn!: number;

  passwordRegex?: string;
  checkPasswordForBreach?: boolean;
}

export type UserPoolAlgorithm = 'RS256' | 'RS384' | 'RS512' | 'ES384' | 'ES512';
