import { parseConnectionString } from './postgres.util';

describe('pg-adapter/util', () => {
  it('should parse postgresql://', () => {
    const parsed = parseConnectionString('postgresql://');
    expect(parsed).toEqual({
      host: 'localhost',
    });
  });
  it('should parse postgresql://localhost', () => {
    const parsed = parseConnectionString('postgresql://');
    expect(parsed).toEqual({
      host: 'localhost',
    });
  });
  it('should parse postgresql://localhost:5433', () => {
    const parsed = parseConnectionString('postgresql://localhost:5433');
    expect(parsed).toEqual({
      host: 'localhost',
      port: 5433,
    });
  });
  it('should parse postgresql://localhost/mydb', () => {
    const parsed = parseConnectionString('postgresql://localhost/mydb');
    expect(parsed).toEqual({
      host: 'localhost',
      database: 'mydb',
    });
  });
  it('should parse postgresql://user@localhost', () => {
    const parsed = parseConnectionString('postgresql://user@localhost');
    expect(parsed).toEqual({
      host: 'localhost',
      user: 'user',
    });
  });
  it('should parse postgresql://user:secret@localhost', () => {
    const parsed = parseConnectionString('postgresql://user:secret@localhost');
    expect(parsed).toEqual({
      host: 'localhost',
      user: 'user',
      password: 'secret',
    });
  });
  it('should parse postgresql://other@localhost/otherdb?connect_timeout=10&application_name=myapp', () => {
    const parsed = parseConnectionString(
      'postgresql://other@localhost/otherdb?connect_timeout=10&application_name=myapp',
    );
    expect(parsed).toEqual({
      host: 'localhost',
      user: 'other',
      database: 'otherdb',
      connect_timeout: 10,
      application_name: 'myapp',
    });
  });
  it('should parse postgresql:///mydb?host=localhost&port=5433', () => {
    const parsed = parseConnectionString('postgresql:///mydb?host=localhost&port=5433');
    expect(parsed).toEqual({
      host: 'localhost',
      database: 'mydb',
      port: 5433,
    });
  });
  it('should parse postgresql://[2001:db8::1234]/database', () => {
    const parsed = parseConnectionString('postgresql://[2001:db8::1234]/database');
    expect(parsed).toEqual({
      host: '2001:db8::1234',
      database: 'database',
    });
  });
  it('should parse postgresql:///dbname?host=/var/lib/postgresql', () => {
    const parsed = parseConnectionString('postgresql:///dbname?host=/var/lib/postgresql');
    expect(parsed).toEqual({
      host: '/var/lib/postgresql',
      database: 'dbname',
    });
  });
  it('should parse postgresql://%2Fvar%2Flib%2Fpostgresql', () => {
    const parsed = parseConnectionString('postgresql://%2Fvar%2Flib%2Fpostgresql');
    expect(parsed).toEqual({
      host: '/var/lib/postgresql',
    });
  });
  it('should parse postgresql://%2Fvar%2Flib%2Fpostgresql/dbname', () => {
    const parsed = parseConnectionString('postgresql://%2Fvar%2Flib%2Fpostgresql/dbname');
    expect(parsed).toEqual({
      host: '/var/lib/postgresql',
      database: 'dbname',
    });
  });
});
