import { FormatContext } from './format-context';

export class Formatter {
  private handlers: FormatterHandler[] = [];

  add<T>(handler: FormatterHandler) {
    this.handlers.push(handler);
    return this;
  }

  format(value: any, ctx: FormatContext): string {
    for (const formatter of this.handlers) {
      const result = formatter.handle(value, ctx, this);
      if (result !== null) {
        return result;
      }
    }

    throw new Error(`unable to format ${JSON.stringify(value)}`);
  }
}

export interface FormatterHandler {
  handle(param: any, ctx: FormatContext, formatter: Formatter): string | null;
}
