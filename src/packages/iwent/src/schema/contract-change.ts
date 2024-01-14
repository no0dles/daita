import { Json } from '@daita/relational';

export class DaitaContractChange {
  static table = 'eventContractChange';
  static schema = 'daita';

  contractId!: string;
  change!: Json<any>;
  index!: string;
}
