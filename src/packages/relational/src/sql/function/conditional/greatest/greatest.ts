import { GreatestDescription } from './greatest-description';

export function greatest(left: number, right: number): number;
export function greatest(left: number, right: number | null | undefined): number;
export function greatest(left: number | null | undefined, right: number): number;
export function greatest(left: number | null | undefined, right: number | null | undefined): number | null;
export function greatest(left: number | null | undefined, right: number | null | undefined): number | null {
  return (<GreatestDescription>{ greatest: { left, right } }) as any;
}
