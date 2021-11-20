import { Client } from '@daita/relational/client/client';

export interface IwentHandlerContext {
  state: Client<any>;
  metadata: {
    createdAt: Date;
    eventId: string;
    userIssuer?: string;
    userId?: string;
  };
}
