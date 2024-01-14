import { FloorDescription } from './floor-description';

export function floor(value: number): number;
export function floor(value: number | null | undefined): number | null;
export function floor(value: number | null | undefined): number | null {
  return (<FloorDescription>{ floor: { value } }) as any;
}
