import { ESLintUtils } from '@typescript-eslint/experimental-utils';

export default ESLintUtils.RuleCreator((name) => `https://...`)({
  name: 'ban-import',
  meta: {
    docs: {
      description: 'Forbidds specified import sources',
      category: 'Possible Errors',
      recommended: 'error',
      requiresTypeChecking: true,
    },
    fixable: 'code',
    messages: {
      bannedImport: 'This import statement is forbidden',
    },
    schema: [
      {
        type: 'object',
        properties: {},
      },
    ],
    type: 'problem',
  },
  defaultOptions: [{}],
  create: (context, options) => {
    const sourceCode = context.getSourceCode();
    const parserServices = ESLintUtils.getParserServices(context);
    const checker = parserServices.program.getTypeChecker();
    const compilerOptions = parserServices.program.getCompilerOptions();

    return {
      ImportDeclaration: (node) => {
        console.log(node);
        // if(node.moduleSpecifier.getFullText().indexOf("src") >= 0) {
        //   context.report({
        //     node,
        //     messageId: 'bannedImport',
        //     fix(fixer) {
        //       fixer.
        //     }
        //   });
        // }
        return false;
      },
    };
  },
});
