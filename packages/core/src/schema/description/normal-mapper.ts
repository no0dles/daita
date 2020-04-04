import {NameMapper} from './name-mapper';

export class NormalMapper implements NameMapper {
  add(name: string, migrationId: string): string {
    return name;
  }

  drop(name: string): string {
    return name;
  }

  get(name: string): string {
    return name;
  }
}
