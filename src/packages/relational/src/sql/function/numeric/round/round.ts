import { RoundDescription } from './round-description';

export function round(value: number, precision?: number): number;
export function round(value: number | null | undefined, precision?: number): number | null {
  return (<RoundDescription>{ round: { value, precision } }) as any;
}
