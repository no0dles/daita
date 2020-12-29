import { Person } from './person';
import { Ascent } from './ascent';
import { UUID } from '../../../packages/relational/types/uuid/uuid';

export class AscentPerson {
  ascent!: Ascent;
  ascentId!: UUID;
  person!: Person;
  personId!: UUID;
}
