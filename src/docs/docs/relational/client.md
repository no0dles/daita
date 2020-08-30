---
id: client
title: Client
sidebar_label: Client
---

```typescript
import {getClient} from '@daita/relational';
import {pg} from '@daita/pg-adapter';

const client = await getClient(pg);
const raw = await client.exec({
   select: [1]
});
```

Select

