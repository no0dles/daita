import { Mountain } from './mountain';
import { UUID } from '@daita/relational';

export class Ascent {
  id!: UUID;
  date!: Date;
  mountain!: Mountain;
  mountainId!: UUID;
}
