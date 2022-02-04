import { LeastDescription } from './least-description';

export function least(left: number, right: number): number;
export function least(left: number, right: number | null | undefined): number;
export function least(left: number | null | undefined, right: number): number;
export function least(left: number | null | undefined, right: number | null | undefined): number | null;
export function least(left: number | null | undefined, right: number | null | undefined): number | null {
  return (<LeastDescription>{ least: { left, right } }) as any;
}
