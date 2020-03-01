export class User {
  id!: string;
  name!: string;
  count!: number | null;
  parentId!: string | null;
  parent!: User | null;
  admin!: boolean;
}