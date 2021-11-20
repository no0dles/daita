import { FormatHandle, Formatter, FormatType } from '../../../../formatter/formatter';
import { FormatContext } from '../../../../formatter/format-context';
import { isLeastDescription, LeastDescription } from './least-description';

export class LeastFormatter implements FormatHandle<LeastDescription> {
  type = FormatType.Value;

  canHandle(param: any): boolean {
    return isLeastDescription(param);
  }

  handle(param: LeastDescription, ctx: FormatContext, formatter: Formatter): string {
    return `CASE WHEN ${formatter.format(param.least.left, ctx)} IS NULL AND ${formatter.format(
      param.least.right,
      ctx,
    )} IS NULL THEN NULL WHEN ${formatter.format(param.least.left, ctx)} IS NULL THEN ${formatter.format(
      param.least.right,
      ctx,
    )} WHEN ${formatter.format(param.least.right, ctx)} IS NULL THEN ${formatter.format(
      param.least.left,
      ctx,
    )} WHEN ${formatter.format(param.least.left, ctx)} < ${formatter.format(
      param.least.right,
      ctx,
    )} THEN ${formatter.format(param.least.left, ctx)} ELSE ${formatter.format(param.least.right, ctx)} END`;
  }
}
