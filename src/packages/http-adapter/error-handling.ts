import { HttpSendResult } from '../http-client-common';
import { RuleError } from '../orm/error/rule-error';

export function handleErrorResponse(response: HttpSendResult) {
  if (response.statusCode === 403 && response.data?.error === 'RuleError') {
    throw new RuleError(response.data.message);
  } else if (response.statusCode === 500) {
    throw new Error(response.data?.message || 'internal error');
  }
}
