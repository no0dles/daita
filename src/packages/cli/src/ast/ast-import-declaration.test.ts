import { authorized } from '@daita/relational/permission/function/authorized';
import { allow } from '@daita/relational/permission/function/allow';
import { Rule } from '@daita/relational/permission/description/rule';
import { all } from '@daita/relational/sql/keyword/all/all';

const rules: Rule[] = [allow(authorized(), { select: all() })];
