import {
  RelationalTransactionAdapter,
} from '@daita/relational';
import { relationalSelectTest } from './select/select';

export function relationalTest(factory: () => Promise<RelationalTransactionAdapter>) {
  describe('relational-test', () => {
    relationalSelectTest(factory);
  });
}
