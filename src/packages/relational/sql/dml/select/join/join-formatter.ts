import { FormatHandle, Formatter, FormatType } from '../../../../formatter/formatter';
import { isJoinDescription, JoinDescription } from './join-description';
import { FormatContext } from '../../../../formatter/format-context';

export class JoinFormatter implements FormatHandle<JoinDescription> {
  type = FormatType.Join;

  canHandle(param: any): boolean {
    return isJoinDescription(param);
  }

  handle(param: JoinDescription, ctx: FormatContext, formatter: Formatter): string {
    return `${this.getJoinType(param)} ${formatter.format(param.table, ctx)} ON ${formatter.format(
      param.condition,
      ctx,
    )}`;
  }

  private getJoinType(param: JoinDescription): string {
    switch (param.join) {
      case 'left':
        return 'LEFT JOIN';
      case 'right':
        return 'RIGHT JOIN';
      case 'full':
        return 'FULL JOIN';
      case 'inner':
        return 'JOIN';
      case 'cross':
        return 'CROSS JOIN';
    }
  }
}
