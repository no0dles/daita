import {NameMapper} from './name-mapper';

export class SchemaMapper implements NameMapper {
  private table: NameMapper;
  private fieldsMap: { [key: string]: NameMapper } = {};

  constructor(private mapperFactory: () => NameMapper) {
    this.table = mapperFactory();
  }

  field(table: string): NameMapper {
    return this.fieldsMap[table];
  }

  add(name: string, migrationId: string): string {
    this.fieldsMap[name] = this.mapperFactory();
    return this.table.add(name, migrationId);
  }

  drop(name: string): string {
    delete this.fieldsMap[name];
    return this.table.drop(name);
  }

  get(name: string): string {
    return this.table.get(name);
  }
}
