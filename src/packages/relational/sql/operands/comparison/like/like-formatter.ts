import { FormatHandle, Formatter, FormatType } from '../../../../formatter/formatter';
import { FormatContext } from '../../../../formatter/format-context';
import { isLikeDescription, LikeDescription } from './like-description';

export class LikeFormatter implements FormatHandle<LikeDescription<any>> {
  type = FormatType.Condition;

  canHandle(param: any): boolean {
    return isLikeDescription(param);
  }

  handle(param: LikeDescription<any>, ctx: FormatContext, formatter: Formatter): string {
    return `${formatter.format(param.like.left, ctx)} LIKE ${formatter.format(param.like.right, ctx)}`;
  }
}
