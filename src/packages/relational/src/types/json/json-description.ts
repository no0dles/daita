import { isExactKind } from '@daita/common';

export interface JsonDescription {
  json: { value: any };
}

export const isJsonDescription = (val: any): val is JsonDescription =>
  isExactKind<JsonDescription>(val, ['json']) && typeof val.json.value !== 'undefined';
