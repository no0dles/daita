import {TypeProvider} from './type-provider';
import {ClassProvider} from './class-provider';
import {ValueProvider} from './value-provider';
import {FactoryProvider} from './factory-provider';

export type Provider = TypeProvider | ValueProvider<any> | ClassProvider | FactoryProvider;
