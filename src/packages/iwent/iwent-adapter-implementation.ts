import { IwentAdapter } from './iwent-adapter';

export interface IwentAdapterImplementation<TOptions> {
  getRelationalAdapter(options: TOptions): IwentAdapter;
}
