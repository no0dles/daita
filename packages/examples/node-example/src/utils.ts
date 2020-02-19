import {DefaultConstructable} from '@daita/core/dist/constructable';


export class SchemaRules {
  table<T>(type: DefaultConstructable<T>) {
    return {
      rule: (options: any) => {

      },
    }
  }
}
