import { FormatContext } from './format-context';

export class Formatter {
  private handlers: FormatHandle<any>[] = [];

  extend(formatter: Formatter) {
    this.handlers.push(...formatter.handlers);
    return this;
  }

  add<T>(handler: FormatHandle<any>) {
    this.handlers.push(handler);
    return this;
  }

  canHandle(value: any) {
    const availableFormatters = this.handlers.filter(h => h.canHandle(value));
    return availableFormatters.length == 1;
  }

  format(value: any, ctx: FormatContext): string {
    const availableFormatters = this.handlers.filter(h => h.canHandle(value));
    if (availableFormatters.length === 0) {
      throw new Error(`unable to format ${JSON.stringify(value)}`);
    }

    if (availableFormatters.length > 1) {
      throw new Error(`more than one formatter for ${JSON.stringify(value)}`);
    }

    return availableFormatters[0].handle(value, ctx, this);
  }
}

export enum FormatType {
  Sql,
  Value,
  Condition,
  Table,
  Join,
  OrderBy,
}

export interface FormatHandle<T> {
  type: FormatType | FormatType[];

  canHandle(param: any): boolean;

  handle(param: T, ctx: FormatContext, formatter: Formatter): string;
}
