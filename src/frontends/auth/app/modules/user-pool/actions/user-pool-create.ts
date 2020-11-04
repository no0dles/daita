export class UserPoolCreate {
  static readonly type = '[UserPool] Create';

  constructor(
    public name: string,
    public refreshRefreshExpiresIn: number,
    public accessTokenExpiresIn: number,
    public checkPasswordForBreach: boolean,
    public allowRegistration: boolean,
    public algorithm: string,
    public passwordRegex: string,
    public emailVerifyExpiresIn: number,
  ) {}
}
