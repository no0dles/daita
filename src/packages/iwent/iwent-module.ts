import { Constructable } from '../common/types/constructable';
import { IwentHandler } from './iwent-handler';

export class IwentModule {
  constructor(public readonly name: string) {}

  handle<T>(event: Constructable<T>, handler: Constructable<IwentHandler<T>>) {}
}
