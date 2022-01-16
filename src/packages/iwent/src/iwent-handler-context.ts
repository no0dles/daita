import { RelationalAdapter } from '@daita/relational';

export interface IwentHandlerContext {
  state: RelationalAdapter<any>;
  metadata: {
    createdAt: Date;
    eventId: string;
    userIssuer?: string;
    userId?: string;
  };
}
