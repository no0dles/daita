import { authorized } from '../../relational/permission/function/authorized';
import { allow } from '../../relational/permission/function/allow';
import { Rule } from '../../relational/permission/description/rule';
import { all } from '../../relational/sql/keyword/all/all';

const rules: Rule[] = [allow(authorized(), { select: all() })];
