import {Permission} from './permission';
import {TableInformation} from '../context/table-information';

export class PermissionBuilder {
  private permissions: { [key: string]: Permission<any>[] } = {};

  push<T>(type: TableInformation<T>, perm: Permission<T>) {
    if (!this.permissions[type.name]) {
      this.permissions[type.name] = [];
    }
    this.permissions[type.name].push(perm);
  }

  extend(builder: PermissionBuilder) {
    for (const permissionKey of Object.keys(builder.permissions)) {
      for (const permission of builder.permissions[permissionKey]) {
        this.push({name: permissionKey}, permission);
      }
    }
  }
}