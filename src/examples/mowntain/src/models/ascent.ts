import { Mountain } from './mountain';
import { UUID } from '@daita/relational/types/uuid/uuid';

export class Ascent {
  id!: UUID;
  date!: Date;
  mountain!: Mountain;
  mountainId!: UUID;
}
