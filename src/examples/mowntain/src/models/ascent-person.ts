import { Person } from './person';
import { Ascent } from './ascent';
import { UUID } from '@daita/relational';

export class AscentPerson {
  ascent!: Ascent;
  ascentId!: UUID;
  person!: Person;
  personId!: UUID;
}
