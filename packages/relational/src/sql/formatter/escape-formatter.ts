import { FormatterHandler } from './formatter';
import { isKind } from '@daita/common';

export interface EscapeFormatterOptions {
  escapeCharacter: string;
}

export interface EscapeValue {
  escape: string;
}

export class EscapeFormatter implements FormatterHandler {
  constructor(private options: EscapeFormatterOptions) {

  }

  handle(param: any) {
    if (isKind<EscapeValue>(param, ['escape'])) {
      return `${this.options.escapeCharacter}${param.escape}${this.options.escapeCharacter}`;
    }
    return null;
  }
}
