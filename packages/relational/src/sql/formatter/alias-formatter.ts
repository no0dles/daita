import { Formatter, FormatterHandler } from './formatter';
import { isKind } from '@daita/common';
import { FormatContext } from './format-context';

export interface AliasFormatterOptions {
  aliasKeyword: string;
}

export interface AliasValue {
  alias: { name: string; value: string; }
}

export class AliasFormatter implements FormatterHandler {
  constructor(private options: AliasFormatterOptions) {

  }

  handle(param: any, ctx: FormatContext, formatter: Formatter) {
    if (isKind<AliasValue>(param, ['alias'])) {
      return `${param.alias.value} ${this.options.aliasKeyword} ${formatter.format({ escape: param.alias.name }, ctx)}`;
    }
    return null;
  }
}

