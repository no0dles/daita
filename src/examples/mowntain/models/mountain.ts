import { Canton } from './canton';
import { UUID } from '../../../packages/relational/types/uuid';

export class Mountain {
  id!: UUID;
  name!: string;
  canton!: Canton;
  cantonShortname!: string;
  elevation!: number;
  prominence!: number;
  // coordinates!: {
  //   lat: number;
  //   lon: number;
  // };
}
