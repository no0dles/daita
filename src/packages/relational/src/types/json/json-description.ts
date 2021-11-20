import { isExactKind } from '@daita/common/utils/is-exact-kind';

export interface JsonDescription {
  json: { value: any };
}

export const isJsonDescription = (val: any): val is JsonDescription =>
  isExactKind<JsonDescription>(val, ['json']) && typeof val.json.value !== 'undefined';
