import { FormatHandle, Formatter, FormatType } from '../../../../formatter/formatter';
import { isOrderByDescription, OrderByDescription } from './order-by-description';
import { FormatContext } from '../../../../formatter/format-context';

export class OrderByFormatter implements FormatHandle<OrderByDescription> {
  type = FormatType.OrderBy;

  canHandle(param: any): boolean {
    return isOrderByDescription(param);
  }

  handle(param: OrderByDescription, ctx: FormatContext, formatter: Formatter): string {
    return `${formatter.format(param.value, ctx)} ${this.getOrderBy(param)}`;
  }

  private getOrderBy(orderBy: OrderByDescription) {
    switch (orderBy.direction) {
      case 'asc':
        return 'ASC';
      case 'desc':
        return 'DESC';
    }
  }
}
