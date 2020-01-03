import { RootFilter } from '../query/root-filter';

export interface RelationalSelectQuery {
  skip: number | null;
  limit: number | null;
  orderBy: { path: string[]; direction: 'asc' | 'desc' }[];
  include: { path: string[] }[];
  filter: RootFilter<any> | null;
}
