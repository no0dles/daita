import { FormatHandle, Formatter, FormatType } from '../../../../formatter/formatter';
import { FormatContext } from '../../../../formatter/format-context';
import { isGreatestDescription, GreatestDescription } from './greatest-description';

export class GreatestFormatter implements FormatHandle<GreatestDescription> {
  type = FormatType.Value;

  canHandle(param: any): boolean {
    return isGreatestDescription(param);
  }

  handle(param: GreatestDescription, ctx: FormatContext, formatter: Formatter): string {
    return `CASE WHEN ${formatter.format(param.greatest.left, ctx)} IS NULL AND ${formatter.format(
      param.greatest.right,
      ctx,
    )} IS NULL THEN NULL WHEN ${formatter.format(param.greatest.left, ctx)} IS NULL THEN ${formatter.format(
      param.greatest.right,
      ctx,
    )} WHEN ${formatter.format(param.greatest.right, ctx)} IS NULL THEN ${formatter.format(
      param.greatest.left,
      ctx,
    )} WHEN ${formatter.format(param.greatest.left, ctx)} > ${formatter.format(
      param.greatest.right,
      ctx,
    )} THEN ${formatter.format(param.greatest.left, ctx)} ELSE ${formatter.format(param.greatest.right, ctx)} END`;
  }
}
