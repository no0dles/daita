export interface Iwent {
  id: string;
  type: string;
  payload: any;
  createdAt: Date;
  userId?: string;
  userIssuer?: string;
}
