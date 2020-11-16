import { Canton } from './canton';

export class Mountain {
  id!: string;
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
