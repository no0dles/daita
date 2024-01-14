import { Canton } from './canton';
import { UUID } from '@daita/relational';
import { Json } from '@daita/relational';

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
