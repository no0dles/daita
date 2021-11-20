import { UUID } from '@daita/relational';

export class Person {
  id!: UUID;
  firstName!: string;
  lastName!: string;
  birthday?: Date;
  active!: boolean;
}
