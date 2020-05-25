import { SqlRawValue } from '../dml';

export interface FormatContext {
  getValues(): SqlRawValue[];

  appendValue(value: SqlRawValue): string;
}
