export function Collection(name: string): ClassDecorator {
  return target => {
    (<any>target).collection = name;
  };
}
