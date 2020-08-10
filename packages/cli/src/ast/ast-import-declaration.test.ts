import { authorized, allow, Rule, all } from '@daita/relational';
import * as rel from '@daita/relational';

const rules: Rule[] = [
  allow(authorized(), {select: all()})
]
