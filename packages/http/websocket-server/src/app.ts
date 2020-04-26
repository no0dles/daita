import * as http from "http";
import * as socketIo from "socket.io";
import { SocketRawEvent } from "./events/socket-raw-event";
import { AppOptions } from "../app-options";
import { ContextManager } from "../context-manager";
import { SocketBeginTransaction } from "./events/socket-begin-transaction";
import { SocketRollbackTransaction } from "./events/socket-rollback-transaction";
import { SocketCommitTransaction } from "./events/socket-commit-transaction";
import { SocketAuthEvent } from "./events/socket-auth-event";
import { SqlPermissions } from "@daita/relational";

function handle<T>(
  socket: socketIo.Socket,
  event: string,
  action: (data: T) => Promise<any>
) {
  socket.on(event, async data => {
    try {
      const result = await action(data);
      socket.emit(event, { cid: data.cid, result });
    } catch (e) {
      socket.emit("err", { cid: data.cid, err: e.message });
    }
  });
}

export function createSocketApp(
  server: http.Server,
  options: AppOptions
): http.Server {
  const io = socketIo(server);

  io.on("connection", socket => {
    let permissions: SqlPermissions | null = null;
    let userExpireTimeout: NodeJS.Timeout | null = null;
    const manager = new ContextManager(options, socket);

    handle<SocketAuthEvent>(socket, "auth", async data => {
      if (options.auth) {
        if (data.kind === "token") {
          const auth = await options.auth.tokenProvider.verify(data.token);
          permissions = auth.permissions ?? null;
          if (auth.expireIn) {
            if (userExpireTimeout) {
              clearTimeout(userExpireTimeout);
            }
            userExpireTimeout = setTimeout(() => {
              permissions = null;
            }, auth.expireIn);
          }
          return {};
        } else if (data.kind === "userpass") {
          throw new Error("no userpass auth configured");
        }
      } else {
        throw new Error("no auth configured");
      }
    });

    handle<SocketBeginTransaction>(socket, "beginTrx", async data => {
      await manager.beginTransaction(data.tid);
    });

    handle<SocketRollbackTransaction>(socket, "rollbackTrx", async data => {
      await manager.rollbackTransaction(data.tid);
    });

    handle<SocketCommitTransaction>(socket, "commitTrx", async data => {
      await manager.commitTransaction(data.tid);
    });

    handle<SocketRawEvent>(socket, "raw", data => {
      return manager.raw(data, permissions);
    });

    socket.on("disconnect", () => {
      manager.close();
      if (userExpireTimeout) {
        clearTimeout(userExpireTimeout);
      }
    });
  });

  return server;
}
