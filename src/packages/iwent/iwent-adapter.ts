import { Iwent } from './iwent';
import { IwentContract } from './iwent-contract';

export interface IwentAdapter {
  addEvent(event: Iwent): Promise<void>;

  getEvent(id: string): Promise<Iwent | null>;

  applyContract(contract: IwentContract): Promise<void>;

  getContracts(): Promise<IwentContract[]>;
}

export const isIwentAdapter = (val: any): val is IwentAdapter =>
  typeof val.addEvent === 'function' &&
  typeof val.getEvent === 'function' &&
  typeof val.applyContract === 'function' &&
  typeof val.getContracts === 'function';
