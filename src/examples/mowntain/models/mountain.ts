import { Canton } from './canton';
import { UUID } from '../../../packages/relational/types/uuid/uuid';
import { Json } from '../../../packages/relational/types/json/json';

export class Mountain {
  id!: UUID;
  name!: string;
  canton!: Canton;
  cantonShortname!: string;
  elevation!: number;
  prominence!: number;
  ascents?: number;
  extra?: Json<{ bool: boolean; text: string; value: number; date: Date }>;
  // coordinates!: {
  //   lat: number;
  //   lon: number;
  // };
}
