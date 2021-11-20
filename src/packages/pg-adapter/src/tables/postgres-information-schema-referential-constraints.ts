import { PostgresForeignKeyMatchOption } from './postgres-foreign-key-match-option';
import { PostgresForeignKeyConstraint } from './postgres-foreign-key-constraint';

export class PostgresInformationSchemaReferentialConstraints {
  static schema = 'information_schema';
  static table = 'referential_constraints';

  constraint_catalog!: string;
  constraint_schema!: string;
  constraint_name!: string;
  unique_constraint_catalog!: string;
  unique_constraint_schema!: string;
  unique_constraint_name!: string;
  match_option!: PostgresForeignKeyMatchOption;
  update_rule!: PostgresForeignKeyConstraint;
  delete_rule!: PostgresForeignKeyConstraint;
}
