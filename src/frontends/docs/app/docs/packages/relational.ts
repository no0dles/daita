import { allDbs, Section } from '../../section';
import { field, table } from '../../../../../packages/relational';
import { Mountain } from '../../../../../examples/mowntain/models/mountain';
import { all } from '../../../../../packages/relational/sql/keyword/all/all';
import { subSelect } from '../../../../../packages/relational/sql/dml/select/subquery/sub-select';
import { count } from '../../../../../packages/relational/sql/function/aggregation/count/count';
import { Canton } from '../../../../../examples/mowntain/models/canton';
import { equal } from '../../../../../packages/relational/sql/operands/comparison/equal/equal';
import { greaterThan } from '../../../../../packages/relational/sql/operands/comparison/greater-than/greater-than';
import { concat } from '../../../../../packages/relational/sql/function/string/concat/concat';

export const relationalSections: Section[] = [
  {
    title: 'select',
    id: 'query-select',
    description: '',
    sections: [
      {
        title: 'select',
        id: 'select',
        description: '',
        sections: [
          {
            title: 'field',
            id: 'select-field',
            description: '',
            snippets: [
              {
                code: {
                  select: field(Mountain, 'name'),
                  from: table(Mountain),
                },
                supportedBy: allDbs,
              },
              {
                code: {
                  select: { name: field(Mountain, 'name') },
                  from: table(Mountain),
                },
                supportedBy: allDbs,
              },
            ],
          },
          {
            title: 'all',
            id: 'select-all',
            description: '',
            snippets: [
              {
                code: {
                  select: all(),
                  from: table(Mountain),
                },
                supportedBy: allDbs,
              },
              {
                code: {
                  select: all(Mountain),
                  from: table(Mountain),
                },
                supportedBy: allDbs,
              },
            ],
          },
          {
            title: 'subquery',
            id: 'select-subquery',
            snippets: [
              {
                code: {
                  select: {
                    name: field(Mountain, 'name'),
                    cantonName: subSelect({
                      select: count(),
                      from: table(Canton),
                      where: equal(field(Canton, 'shortname'), field(Mountain, 'cantonShortname')),
                    }),
                  },
                  from: table(Mountain),
                },
                supportedBy: allDbs,
              },
            ],
          },
        ],
      },
      {
        title: 'join',
        id: 'select-join',
        sections: [
          { title: 'left join', id: 'select-join-left' },
          { title: 'right join', id: 'select-join-right' },
        ],
      },
      {
        title: 'where',
        id: 'select-where',
        sections: [
          { title: 'and', id: 'select-where-and' },
          { title: 'or', id: 'select-where-or' },
        ],
      },
      {
        title: 'group by',
        id: 'select-group-by',
        snippets: [
          {
            code: {
              select: { canton: field(Mountain, 'cantonShortname'), count: count() },
              from: table(Mountain),
              groupBy: field(Mountain, 'cantonShortname'),
            },
            supportedBy: allDbs,
          },
        ],
      },
      {
        title: 'having by',
        id: 'select-having-by',
        snippets: [
          {
            code: {
              select: { canton: field(Mountain, 'cantonShortname'), count: count() },
              from: table(Mountain),
              groupBy: field(Mountain, 'cantonShortname'),
              having: greaterThan(count(), 10),
            },
            supportedBy: allDbs,
          },
        ],
      },
      {
        title: 'order by',
        id: 'select-order-by',
        snippets: [
          {
            code: {
              select: field(Mountain, 'name'),
              from: table(Mountain),
              orderBy: field(Mountain, 'name'),
            },
            supportedBy: allDbs,
          },
        ],
      },
      {
        title: 'limit',
        id: 'select-limit',
        snippets: [
          {
            code: {
              select: all(),
              from: table(Mountain),
              limit: 10,
            },
            supportedBy: allDbs,
          },
        ],
      },
      {
        title: 'offset',
        id: 'select-offset',
        snippets: [
          {
            code: {
              select: all(),
              from: table(Mountain),
              limit: 10,
              offset: 20,
            },
            supportedBy: allDbs,
          },
        ],
      },
    ],
  },
  {
    title: 'update',
    id: 'query-update',
    sections: [
      { title: 'update', id: 'update' },
      { title: 'set', id: 'update-set' },
      { title: 'where', id: 'update-where' },
    ],
  },
  {
    title: 'insert',
    id: 'query-insert',
    sections: [
      {
        id: 'insert-row',
        title: 'row',
        snippets: [
          {
            code: {
              insert: {
                id: 'matterhorn',
                name: 'Matterhorn',
                cantonShortname: 'VS',
                elevation: 4478,
                prominence: 1042,
              },
              into: table(Mountain),
            },
            supportedBy: allDbs,
          },
        ],
      },
      {
        id: 'insert-rows',
        title: 'rows',
        snippets: [
          {
            code: {
              insert: [
                {
                  id: 'matterhorn',
                  name: 'Matterhorn',
                  cantonShortname: 'VS',
                  elevation: 4478,
                  prominence: 1042,
                },
                { elevation: 4158, prominence: 695, name: 'Jungfrau', id: 'jungfrau', cantonShortname: 'BE' },
              ],
              into: table(Mountain),
            },
            supportedBy: allDbs,
          },
        ],
      },
      {
        id: 'insert-select',
        title: 'select',
        snippets: [
          {
            code: {
              insert: {
                select: {
                  id: concat(field(Mountain, 'id'), '-2'),
                  name: field(Mountain, 'name'),
                  cantonShortname: field(Mountain, 'cantonShortname'),
                  elevation: field(Mountain, 'elevation'),
                  prominence: field(Mountain, 'prominence'),
                },
                from: table(Mountain),
              },
              into: table(Mountain),
            },
            supportedBy: allDbs,
          },
        ],
      },
    ],
  },
  {
    title: 'delete',
    id: 'query-delete',
    snippets: [
      {
        code: {
          delete: table(Mountain),
          where: equal(field(Mountain, 'id'), 'matterhorn'),
        },
        supportedBy: allDbs,
      },
    ],
  },
  {
    title: 'operands',
    id: 'query-operands',
    sections: [
      { title: 'equal', id: 'operand-equal' },
      { title: 'not equal', id: 'operand-not-equal' },
      { title: 'lower than', id: 'operand-lower-than' },
      { title: 'lower equal than', id: 'operand-lower-equal-than' },
      { title: 'greater than', id: 'operand-greater-than' },
      { title: 'greater equal than', id: 'operand-greater-equal-than' },
      { title: 'between', id: 'operand-between' },
      { title: 'not between', id: 'operand-not-between' },
      { title: 'in', id: 'operand-in' },
      { title: 'not in', id: 'operand-not-in' },
      { title: 'like', id: 'operand-like' },
      { title: 'not like', id: 'operand-not-like' },
      { title: 'exists', id: 'operand-exists' },
    ],
  },
  {
    title: 'functions',
    id: 'query-functions',
    sections: [
      { title: 'concat', id: 'functions-concat' },
      { title: 'now', id: 'functions-now' },
    ],
  },
  {
    title: 'create table',
    id: 'query-create-table',
    sections: [
      { title: 'columns', id: 'create-table-columns' },
      { title: 'foreign keys', id: 'create-table-foreign-keys' },
    ],
  },
  {
    title: 'alter table',
    id: 'query-alter-table',
    sections: [
      { title: 'add column', id: 'alter-table-add-column' },
      { title: 'drop column', id: 'alter-table-drop-column' },
      { title: 'rename column', id: 'alter-table-rename-column' },
      { title: 'add primary key', id: 'alter-table-add-primary-key' },
      { title: 'drop primary key', id: 'alter-table-drop-primary-key' },
      { title: 'add foreign key', id: 'alter-table-add-foreign-key' },
      { title: 'drop foreign key', id: 'alter-table-drop-foreign-key' },
    ],
  },
  {
    title: 'drop table',
    id: 'query-drop-table',
    sections: [{ title: 'if exists', id: 'drop-table-if-exists' }],
  },
  {
    title: 'create view',
    id: 'query-create-view',
    sections: [{ title: 'or replace', id: 'create-view-or-replace' }],
  },
  {
    title: 'create index',
    id: 'query-create-index',
    sections: [{ title: 'unique', id: 'create-index-unique' }],
  },
  {
    title: 'drop index',
    id: 'query-drop-index',
    sections: [],
  },
];
