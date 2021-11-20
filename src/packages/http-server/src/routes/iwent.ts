// import { Resolvable } from '@daita/common';
// import { getSchema, IwentSchema } from '../../iwent/iwent-schema';
// import { randomUuid } from '@daita/common';
// import { validate } from '@daita/common';
// import { HttpServerOptions } from '@daita/http-server-common';
// import { Router } from 'express';
// import { getRequestUser } from '@daita/http-server-common';
// import { IwentContractType } from '../../iwent/iwent-contract';

// export function iwentRoute(options: HttpServerOptions) {
//   const router = Router();

//   const adapter = options.iwent?.adapter;
//   if (!adapter) {
//     return router;
//   }

//   const schemaResolvable = new Resolvable<IwentSchema>(async () => {
//     const contracts = await adapter.getContracts();
//     return getSchema(contracts);
//   });

//   router.post('/event/:type', async (req, res, next) => {
//     const user = getRequestUser(req);
//     const payload = req.body.payload;
//     const type = req.params.type;
//     const id = req.body.id ?? randomUuid();

//     if (!(typeof type === 'string')) {
//       return res.status(400).json({ message: 'invalid type' });
//     }
//     if (!(typeof id === 'string')) {
//       return res.status(400).json({ message: 'invalid id' });
//     }

//     const schema = await schemaResolvable.get();
//     const event = schema.events[type];
//     if (!event) {
//       return res.status(400).json({ message: 'unknown type' });
//     }

//     if (!user && event.requiresAuthentication) {
//       return res.status(401).json({ message: 'not authenticated' });
//     }
//     if (event.requiresRole && (!user || !user.roles?.some((r) => r === event.requiresRole))) {
//       return res.status(403).json({ message: 'not authorized' });
//     }

//     for (const error of validate(event.type, payload)) {
//       return res.status(400).json(error);
//     }

//     await adapter.addEvent({
//       payload,
//       createdAt: new Date(),
//       type,
//       id,
//       userId: user?.sub,
//       userIssuer: user?.iss,
//     });
//     res.status(200).end();
//   });

//   router.get('/event/:id', async (req, res, next) => {
//     try {
//       const id = req.params.id;
//       if (!(typeof id === 'string')) {
//         return res.status(400).json({ message: 'invalid id' });
//       }

//       const event = await adapter.getEvent(id);
//       if (event) {
//         res.json(event);
//       } else {
//         res.status(404).end();
//       }
//     } catch (e) {
//       next(e);
//     }
//   });

//   router.get('/contract', async (req, res, next) => {
//     try {
//       const contracts = await adapter.getContracts();
//       res.json(contracts);
//     } catch (e) {
//       next(e);
//     }
//   });

//   router.post('/contract', async (req, res, next) => {
//     try {
//       const hasIwentRole = getRequestUser(req)?.roles?.some((r) => r === 'daita:iwent:admin');
//       if (!hasIwentRole) {
//         return res.status(403).json({ message: 'daita:iwent:admin role missing' });
//       }

//       const contract = req.body.contract;
//       for (const error of validate(IwentContractType, contract)) {
//         return res.status(400).json(error);
//       }

//       await adapter.applyContract(contract);
//       res.status(200).end();
//     } catch (e) {
//       next(e);
//     }
//   });

//   return router;
// }
