import { allow } from '../../relational/permission/function/allow';
import { authorized } from '../../relational/permission/function/authorized';
import { Rule } from '../../relational/permission/description/rule';
import { all } from '../../relational/sql/function/all';

const rules: Rule[] = [allow(authorized(), { select: all() })];
