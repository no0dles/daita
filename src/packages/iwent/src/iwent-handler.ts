import {IwentHandlerContext} from './iwent-handler-context';

export interface IwentHandler<T> {
  handle(event: T, context: IwentHandlerContext): Promise<void> | void;
}
