export interface NameMapper {
  add(name: string, migrationId: string): string;

  drop(name: string): string;

  get(name: string): string;
}
