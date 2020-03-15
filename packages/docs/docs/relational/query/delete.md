---
id: delete
title: Delete Query
sidebar_label: Delete
---

Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ac euismod odio, eu consequat dui. Nullam molestie consectetur risus id imperdiet. Proin sodales ornare turpis, non mollis massa ultricies id. Nam at nibh scelerisque, feugiat ante non, dapibus tortor. Vivamus volutpat diam quis tellus elementum bibendum. Praesent semper gravida velit quis aliquam. Etiam in cursus neque. Nam lectus ligula, malesuada et mauris a, bibendum faucibus mi. Phasellus ut interdum felis. Phasellus in odio pulvinar, porttitor urna eget, fringilla lectus. Aliquam sollicitudin est eros. Mauris consectetur quam vitae mauris interdum hendrerit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.

```typescript
import {SqlDelete, DataAdapter} from '@daita/core';

const sql: SqlDelete = {
  from: 'mountains',
  where: {
    height: {$lte: 800},  
  },
};

let dataAdapter: DataAdapter;

await dataAdapter.raw(sql);
```