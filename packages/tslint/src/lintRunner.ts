import {Configuration, Linter, Replacement} from 'tslint';
import * as path from 'path';

export const helper = ({src, rule, fileName}: { src: string; rule: string | { name: string, options: any }; fileName?: string }) => {
  const linter = new Linter({fix: false});
  linter.lint(
    fileName || '',
    src,
    Configuration.parseConfigFile({
      rules: typeof rule === 'string' ? {
        [rule]: [true],
      } : {
        [rule.name]: [true, ...(rule.options ? rule.options : [])],
      },
      rulesDirectory: path.join(__dirname, '..', 'src/rules'),
    }),
  );
  return linter.getResult();
};
