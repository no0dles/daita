export interface RuleValidateNextResult {
  type: 'next';
  error: string;
  path: string[];
  score: number;
}
