export class UserPoolDetailLoad {
  static readonly type = '[UserPoolDetail] Load';
  constructor(public userPoolId: string) {}
}
