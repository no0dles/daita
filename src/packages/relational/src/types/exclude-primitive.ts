import { OmitByValue } from '@daita/common/dist/types/omit-by-value';

export type ExcludePrimitive<T> = OmitByValue<T, number | Date | string | boolean | undefined | null>;
