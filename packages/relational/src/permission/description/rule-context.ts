export interface RuleContext<T = any> {
  isAuthorized: boolean
  user?: T;
}
