import { Json } from '../../relational/types/json/json';

export class DaitaContractChange {
  static table = 'eventContractChange';
  static schema = 'daita';

  contractId!: string;
  change!: Json;
  index!: string;
}
