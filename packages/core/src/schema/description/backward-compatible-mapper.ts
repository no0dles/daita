import {NameMapper} from './name-mapper';

export class BackwardCompatibleMapper implements NameMapper {
  private map: { [key: string]: string } = {};

  add(name: string, migrationId: string) {
    const value = `${name}_${migrationId}`;
    if (this.map[name]) {
      throw new Error('table name already exists for ' + name);
    }
    this.map[name] = value;
    return value;
  }

  drop(name: string) {
    if (!this.map[name]) {
      throw new Error('unable to get table name for ' + name);
    }
    const value = this.map[name];
    delete this.map[name];
    return value;
  }

  get(name: string) {
    const value = this.map[name];
    if (!value) {
      throw new Error('could not find table name for ' + name);
    }
    return value;
  }
}
