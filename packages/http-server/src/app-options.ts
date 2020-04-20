import { TokenProvider } from "./auth/token-provider";
import { RelationalDataAdapter } from "@daita/relational";

export interface AppOptions {
  dataAdapter: RelationalDataAdapter;
  transactionTimeout?: number;
  auth?: {
    tokenProvider: TokenProvider;
  }
}
