export class UserPool {
  id!: string;
  name!: string;
  allowRegistration?: boolean;

  algorithm!: string; //TODO UserPoolAlgorithm;

  accessTokenExpiresIn!: number;
  refreshRefreshExpiresIn!: number;

  emailVerifyExpiresIn!: number;

  passwordRegex?: string;
  checkPasswordForBreach?: boolean;
}

export type UserPoolAlgorithm = 'RS384' | 'RS512' | 'ES384' | 'ES512';
