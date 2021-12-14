import { CaseWhenDescription } from './case-when-description';
import { ConditionDescription, ValueType } from '../../../operands';

export interface ElseCase<T> {
  type: 'else';
}

export interface EmptyCaseBuilder<T> {
  when(condition: ConditionDescription, then: T): CaseBuilder<T>;
}

export interface CaseBuilder<T> {
  when(condition: ConditionDescription, then: T): CaseBuilder<T>;

  else(value: T): ElseCase<T>;
}

export function caseWhen<T extends ValueType>(fn: (builder: EmptyCaseBuilder<T>) => CaseBuilder<T> | ElseCase<T>): T {
  const whens: { condition: ConditionDescription; value: any }[] = [];
  let elseCase: any = undefined;

  const builder: CaseBuilder<any> = {
    when(condition: ConditionDescription, value: T): CaseBuilder<T> {
      whens.push({ condition, value });
      return builder;
    },
    else(value: T): ElseCase<T> {
      elseCase = value;
      return { type: 'else' };
    },
  };

  fn(builder);

  return (<CaseWhenDescription>{ caseWhen: { whens, else: elseCase } }) as any;
}
