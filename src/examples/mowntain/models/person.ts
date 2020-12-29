import { UUID } from '../../../packages/relational/types/uuid/uuid';

export class Person {
  id!: UUID;
  firstName!: string;
  lastName!: string;
  birthday?: Date;
  active!: boolean;
}
