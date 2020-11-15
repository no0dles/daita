import { getSchemaInformation, getSchemaLocation } from '../../utils/path';
import { AstContext } from '../../ast/ast-context';
import * as path from 'path';
import * as fs from 'fs';
import { createLogger } from '../../../common/utils/logger';

export async function diagram(options: { cwd?: string; schema?: string; filename?: string }) {
  const logger = createLogger({ command: 'diagram', package: 'cli', options });
  const schemaLocation = await getSchemaLocation(options);
  const astContext = new AstContext();
  const schemaInfo = await getSchemaInformation(astContext, schemaLocation);
  if (!schemaInfo) {
    throw new Error('could not load schema');
  }

  const nomnoml = require('nomnoml');

  let content =
    '#direction: right\n' +
    '#edges: rounded\n' +
    '#zoom: 2\n' +
    '#fillArrows: true\n' +
    '#leading: 1.75\n' +
    '#spacing: 90\n' +
    '#arrowSize: 0.5\n';

  const relationalSchema = schemaInfo.getRelationalSchema();
  for (const table of relationalSchema.tables) {
    content += `[${table.name}|${table.fields.map((f) => `${f.name}${f.required ? '!' : ''}:${f.type}`).join(';')}]\n`;
    for (const foreignKey of table.references) {
      content += `[${table.name}] ${foreignKey.name}${foreignKey.required ? '+' : 'o'}-> [${foreignKey.table.name}]\n`;
    }
  }

  const svg = nomnoml.renderSvg(content);
  const cwd = options.cwd ? path.resolve(options.cwd) : process.cwd();
  const svgFile = path.join(cwd, options.filename || 'docs/schema.svg');
  const svgDirectory = path.dirname(svgFile);
  if (!fs.existsSync(svgDirectory)) {
    fs.mkdirSync(svgDirectory, { recursive: true });
  }
  logger.info(`Writing diagram to "${svgFile}"`);
  await fs.promises.writeFile(svgFile, svg);
}
