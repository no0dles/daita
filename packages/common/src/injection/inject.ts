import { ResolveOptions } from './resolve-options';
import { InjectOptions } from './inject-options';

export function Inject(type: any, options?: Partial<ResolveOptions>): PropertyDecorator {
  return (target, propertyKey) => {
    if (!(<any>target).inject) {
      (<any>target).inject = [];
    }
    if (!type) {
      throw new Error('type is empty');
    }
    (<any>target).inject.push(<InjectOptions>{
      propertyKey: propertyKey,
      type: type,
      options: options ? { array: options.array } : { array: false },
    });
  };
}

export function getInjects(instance: any): InjectOptions[] {
  if (instance.prototype && instance.prototype.inject) {
    return instance.prototype.inject;
  }

  return [];
}
