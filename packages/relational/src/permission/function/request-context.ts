import { RuleContext } from '../description';

export interface RequestContextDescription {
  getContextValue: (req: RuleContext) => any;
}

export function requestContext<T = { username: string }>(): { user: T, now: Date } {
  return getProxy(true, []);
}

type ProxyAction = ProxyGet | ProxyCall;

interface ProxyGet {
  type: 'get'
  property: PropertyKey;
}

interface ProxyCall {
  type: 'call'
  method: PropertyKey;
  args: any[];
}

function getProxy(root: boolean, actions: ProxyAction[]) {
  return new Proxy(() => {
  }, {
    get(target: any, p: PropertyKey, receiver: any): any {
      if (p === 'getContextValue') {
        return (ctx: any) => {
          let current = ctx;
          for (const action of actions) {
            if (action.type === 'get') {
              current = current[action.property];
            } else {
              current = current[action.method].apply(current, action.args);
            }
          }
          return current;
        };
      }

      return getProxy(false, [...actions, { type: 'get', property: p }]);
    },
    apply(target: () => void, thisArg: any, argArray?: any): any {
      const newActions = [...actions];
      const prevAction = newActions.pop();
      if (!prevAction || prevAction.type !== 'get') {
        throw new Error('unable to proxy');
      }
      newActions.push({
        type: 'call',
        args: argArray,
        method: prevAction.property,
      });
      return getProxy(false, newActions);
    },
  });
}

export const isRequestContext = (val: any): val is RequestContextDescription => {
  return typeof val.getContextValue === 'function';
};

