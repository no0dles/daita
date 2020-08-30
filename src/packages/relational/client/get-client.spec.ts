import { getMockClient } from '../testing';
import { field } from '../sql/function/field';
import { all } from '../sql/function/all';

describe('client', () => {
  it('should map select 1', async () => {
    const client = getMockClient((sql) => {
      return { rowCount: 1, rows: [{ '?column?': 1 }] };
    });
    const result = await client.select({
      select: 1,
    });
    expect(result).toEqual([1]);
  });

  it('should map all select', async () => {
    const client = getMockClient((sql) => {
      return { rowCount: 1, rows: [{ id: 'abc', name: 'foo' }] };
    });
    const result = await client.select({
      select: all(),
    });
    expect(result).toEqual([{ id: 'abc', name: 'foo' }]);
  });

  it('should map nested properties', async () => {
    class Model {
      id!: string;
      name!: string;
    }

    const client = getMockClient((sql) => {
      return { rowCount: 1, rows: [{ 'bar.id': 'abc', 'foo.name': 'foo' }] };
    });
    const result = await client.select({
      select: {
        foo: {
          name: field(Model, 'name'),
        },
        bar: {
          id: field(Model, 'id'),
        },
      },
    });
    expect(result).toEqual([{ bar: { id: 'abc' }, foo: { name: 'foo' } }]);
  });

  it('should map single field select', async () => {
    class Model {
      id!: string;
    }

    const client = getMockClient((sql) => {
      return { rowCount: 1, rows: [{ id: 'abc' }] };
    });
    const result = await client.select({
      select: field(Model, 'id'),
    });
    expect(result).toEqual(['abc']);
  });

  it('should map fields from select', async () => {
    class Model {
      id!: string;
      name!: string;
    }

    const client = getMockClient((sql) => {
      return { rowCount: 1, rows: [{ id: 'abc', modelName: 'foo' }] };
    });
    const result = await client.select({
      select: {
        id: field(Model, 'id'),
        modelName: field(Model, 'name'),
      },
    });
    expect(result).toEqual([{ id: 'abc', modelName: 'foo' }]);
  });
});
