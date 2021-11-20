import { UUID } from '@daita/relational/types/uuid/uuid';

export class Person {
  id!: UUID;
  firstName!: string;
  lastName!: string;
  birthday?: Date;
  active!: boolean;
}
