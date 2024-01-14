import { ConditionDescription } from '../../operands/condition-description';
import { JoinDescription } from './join/join-description';
import { OrderByDescription } from './order-by/order-by-description';
import { ValueType } from '../../operands/value-type';
import { SourceTableDescription } from './source-table';
import { isKind } from '@daita/common';
import { isFieldDescription } from '../../keyword/field/field-description';
import { isAddDescription } from '../../operands/arithmetic/add/add-description';
import { isSubtractDescription } from '../../operands/arithmetic/substract/subtract-description';
import { isMultiplyDescription } from '../../operands/arithmetic/multiply/multiply-description';
import { isDivideDescription } from '../../operands/arithmetic/divide/divide-description';
import { isLeastDescription } from '../../function/conditional/least/least-description';
import { isGreatestDescription } from '../../function/conditional/greatest/greatest-description';
import { isMinDescription } from '../../function/aggregation/min/min-description';
import { isMaxDescription } from '../../function/aggregation/max/max-description';
import { isAvgDescription } from '../../function/aggregation/avg/avg-description';
import { isSumDescription } from '../../function/aggregation/sum/sum-description';
import { isCountDescription } from '../../function/aggregation/count/count-description';
import { isConcatDescription } from '../../function/string/concat/concat-description';
import { isNowDescription } from '../../function/date/now/now-description';
import {
  isCeilDescription,
  isDayOfMonthDescription,
  isDayOfWeekDescription,
  isDayOfYearDescription,
  isFloorDescription,
  isHourDescription,
  isMinuteDescription,
  isMonthDescription,
  isSecondDescription,
  isWeekOfYearDescription,
  isYearDescription,
} from '../../function';
import { isJsonDescription } from '../../../types';

export interface SelectSql<T> {
  select: T;
  from?: SourceTableDescription<any>;
  join?: JoinDescription[];
  where?: ConditionDescription;
  groupBy?: ValueType[] | ValueType;
  having?: ConditionDescription;
  orderBy?: ValueType | OrderByDescription | (OrderByDescription | ValueType)[];
  limit?: number | null;
  offset?: number | null;
}

export const isSelectSql = (val: any): val is SelectSql<any> => isKind<SelectSql<any>>(val, ['select']);

export const isSingleFieldSelect = (fields: any) =>
  isFieldDescription(fields) ||
  isAddDescription(fields) ||
  isSubtractDescription(fields) ||
  isMultiplyDescription(fields) ||
  isDivideDescription(fields) ||
  isLeastDescription(fields) ||
  isGreatestDescription(fields) ||
  isCeilDescription(fields) ||
  isJsonDescription(fields) ||
  isFloorDescription(fields) ||
  isMinDescription(fields) ||
  isMaxDescription(fields) ||
  isAvgDescription(fields) ||
  isSumDescription(fields) ||
  isCountDescription(fields) ||
  isConcatDescription(fields) ||
  isNowDescription(fields) ||
  isMonthDescription(fields) ||
  isYearDescription(fields) ||
  isWeekOfYearDescription(fields) ||
  isDayOfMonthDescription(fields) ||
  isDayOfWeekDescription(fields) ||
  isDayOfYearDescription(fields) ||
  isHourDescription(fields) ||
  isMinuteDescription(fields) ||
  isSecondDescription(fields);
