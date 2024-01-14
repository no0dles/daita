import { RuleError } from '@daita/relational';
import { HttpSendResult } from '@daita/http-interface';

export function handleErrorResponse(response: HttpSendResult) {
  if (response.statusCode === 403 && response.data?.error === 'RuleError') {
    throw new RuleError(response.data.message, response.data.detail);
  } else if (response.statusCode === 500) {
    throw new Error(response.data?.message || 'internal error');
  }
}
