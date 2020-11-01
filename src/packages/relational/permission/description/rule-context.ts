export interface RuleContext<T = any> {
  isAuthorized: boolean;
  userId?: string;
  roles?: string[];
}
