import {InjectScope} from './singleton';

export interface ResolveFunction {
  factory: (...args: any[]) => any;
  deps: any[];
  instance: any | undefined;
  scope: InjectScope;
  type: any;
  id: string;
}