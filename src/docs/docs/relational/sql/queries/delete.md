---
id: delete
title: delete
sidebar_label: delete
---

Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ac euismod odio, eu consequat dui. Nullam molestie consectetur risus id imperdiet. Proin sodales ornare turpis, non mollis massa ultricies id. Nam at nibh scelerisque, feugiat ante non, dapibus tortor. Vivamus volutpat diam quis tellus elementum bibendum. Praesent semper gravida velit quis aliquam. Etiam in cursus neque. Nam lectus ligula, malesuada et mauris a, bibendum faucibus mi. Phasellus ut interdum felis. Phasellus in odio pulvinar, porttitor urna eget, fringilla lectus. Aliquam sollicitudin est eros. Mauris consectetur quam vitae mauris interdum hendrerit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.

```typescript
import {DeleteSql, table, field, equal} from '@daita/relational';

class Mountain {
  height: number;
}

// DELETE FROM Mountain WHERE height = 800
const sql: DeleteSql = {
  from: table(Mountain),
  where: equal(field(Mountain, 'height'), 800)
};
```
