import { Mountain } from './mountain';
import { UUID } from '../../../packages/relational/types/uuid';

export class Ascent {
  id!: UUID;
  date!: Date;
  mountain!: Mountain;
  mountainId!: UUID;
}
