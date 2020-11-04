export class UserDetailLoad {
  static readonly type = '[UserDetail] Load';

  constructor(public userPoolId: string, public username: string) {}
}
