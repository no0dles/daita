import * as express from "express";

function getTransactionId(req: express.Request) {
  if (typeof req.query["tid"] === "string") {
    return req.query["tid"];
  }
}

export function relationalApi(options: AppOptions): express.Router {
  const router = express.Router();
  const manager = new ContextManager(options);

  router.post("/raw", async (req, res, next) => {
    try {
      const tid = getTransactionId(req);
      if (!tid) {
        return res.status(400).json({ message: "invalid tid query" });
      }

      const result = await manager.raw({ sql: req.body.sql, tid }, req.permissions);
      if (req.query.tid) {
        res.setHeader("X-Transaction", tid);
        res.setHeader("X-Transaction-Timeout", manager.getTransactionTimeout(tid));
      }
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  });

  router.post("/trx/:tid", async (req, res, next) => {
    try {
      await manager.beginTransaction(req.params.tid);
      res.setHeader("X-Transaction-Timeout", manager.getTransactionTimeout(req.params.tid));
      res.setHeader("X-Transaction", req.params.tid);
      res.status(200).send();
    } catch (e) {
      next(e);
    }
  });

  router.post("/trx/:tid/commit", async (req, res, next) => {
    try {
      await manager.commitTransaction(req.params.tid);
      res.status(200).send();
    } catch (e) {
      next(e);
    }
  });

  router.post("/trx/:tid/rollback", async (req, res, next) => {
    try {
      await manager.rollbackTransaction(req.params.tid);
      res.status(200).send();
    } catch (e) {
      next(e);
    }
  });

  return router;
}
