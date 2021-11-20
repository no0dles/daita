import { authorized } from '@daita/relational';
import { allow } from '@daita/relational';
import { Rule } from '@daita/relational';
import { all } from '@daita/relational';

const rules: Rule[] = [allow(authorized(), { select: all() })];
