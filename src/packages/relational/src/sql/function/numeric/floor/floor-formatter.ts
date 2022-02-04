import { FormatHandle, Formatter, FormatType } from '../../../../formatter/formatter';
import { FormatContext } from '../../../../formatter/format-context';
import { isFloorDescription, FloorDescription } from './floor-description';

export class FloorFormatter implements FormatHandle<FloorDescription> {
  type = FormatType.Value;

  canHandle(param: any): boolean {
    return isFloorDescription(param);
  }

  handle(param: FloorDescription, ctx: FormatContext, formatter: Formatter): string {
    return `FLOOR(${formatter.format(param.floor.value, ctx)})`;
  }
}
