import { FormatHandle, Formatter, FormatType } from '../../../../formatter/formatter';
import { FormatContext } from '../../../../formatter/format-context';
import { isCaseWhenDescription, CaseWhenDescription } from './case-when-description';

export class CaseWhenFormatter implements FormatHandle<CaseWhenDescription> {
  type = FormatType.Value;

  canHandle(param: any): boolean {
    return isCaseWhenDescription(param);
  }

  handle(param: CaseWhenDescription, ctx: FormatContext, formatter: Formatter): string {
    const parts = param.caseWhen.whens.map(
      (v) => `WHEN ${formatter.format(v.condition, ctx)} THEN ${formatter.format(v.value, ctx)}`,
    );

    if (param.caseWhen.else) {
      parts.push(`ELSE ${formatter.format(param.caseWhen.else, ctx)}`);
    }

    return `CASE ${parts.join(' ')} END`;
  }
}
