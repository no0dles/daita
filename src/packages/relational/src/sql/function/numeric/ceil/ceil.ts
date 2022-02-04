import { CeilDescription } from './ceil-description';

export function ceil(value: number): number;
export function ceil(value: number | null | undefined): number | null | undefined;
export function ceil(value: number | null | undefined): number | null {
  return (<CeilDescription>{ ceil: { value } }) as any;
}
