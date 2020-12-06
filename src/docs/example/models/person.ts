import { UUID } from '../../../packages/relational/types/uuid';

export class Person {
  id!: UUID;
  firstName!: string;
  lastName!: string;
  birthday?: Date;
}
