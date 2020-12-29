import { AddDescription } from './add-description';

export function add(left: number, right: number): number;
export function add(left: number | null | undefined, right: number): number | null;
export function add(left: number, right: number | null | undefined): number | null;
export function add(left: number | null | undefined, right: number | null | undefined): number | null {
  return (<AddDescription>{ add: { left: left, right: right } }) as any;
}
