import { AddDescription } from './add-description';

export function add(left: number, right: number): number {
  return (<AddDescription>{ add: { left: left, right: right } }) as any;
}
