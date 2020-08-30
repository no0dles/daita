import { allow, authorized } from '../../relational/permission/function';
import { all } from '../../relational/sql/function';
import { Rule } from '../../relational/permission/description';

const rules: Rule[] = [allow(authorized(), { select: all() })];
