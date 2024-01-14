import { OmitByValue } from '@daita/common';

export type ExcludePrimitive<T> = OmitByValue<T, number | Date | string | boolean | undefined | null>;
