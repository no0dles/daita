import { MultiplyDescription } from './multiply-description';

export function multiply(left: number, right: number): number {
  return (<MultiplyDescription>{ multiply: { left: left, right: right } }) as any;
}
