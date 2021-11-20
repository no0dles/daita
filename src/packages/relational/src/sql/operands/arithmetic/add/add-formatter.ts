import { FormatContext } from '../../../../formatter/format-context';
import { AddDescription, isAddDescription } from './add-description';
import { FormatHandle, Formatter, FormatType } from '../../../../formatter/formatter';

export class AddFormatter implements FormatHandle<AddDescription> {
  type = FormatType.Value;

  canHandle(param: any): boolean {
    return isAddDescription(param);
  }

  handle(param: AddDescription, ctx: FormatContext, formatter: Formatter): string {
    return `${formatter.format(param.add.left, ctx)} + ${formatter.format(param.add.right, ctx)}`;
  }
}
