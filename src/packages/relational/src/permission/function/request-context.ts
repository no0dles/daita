import { isExactKind } from '@daita/common/utils/is-exact-kind';

export interface RequestContextDescription {
  $requestContext: {
    key: 'userId';
  };
}

// TODO replace with RequestContext<T> to prevent fn calls
export function requestContext(): { userId: string } {
  return {
    userId: {
      $requestContext: { key: 'userId' },
    },
  } as any;
}

export const isRequestContext = (val: any): val is RequestContextDescription => isExactKind(val, ['$requestContext']);
