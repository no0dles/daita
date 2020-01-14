import {Canton} from './canton';

export class Mountain {
  id!: string;
  name!: string;
  height!: number;

  cantonId!: string;
  canton!: Canton;
}