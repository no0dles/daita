# Getting started

```
npm init @daita
```

```
export class Mountain {
  name!: string
  height!: number
}
```

```
import { RelationalSchema } from '@daita/orm';
import { Mountain } from './models/mountain';

export const schema = new RelationalSchema('getting-started');
schema.table(Mountain);
```

```
npx daita migration:add initial
```

```
npx daita migration:apply
```
