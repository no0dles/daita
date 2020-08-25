import { selectTest } from './select/select.test';
import { RelationalTest } from './relational-test';
import { createViewTest } from './create-view/create-view.test';
import { dropViewTest } from './drop-view.test';

export function relationalTest(arg: RelationalTest) {
  selectTest(arg);
  createViewTest(arg);
  dropViewTest(arg);
}
