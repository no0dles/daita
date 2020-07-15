import * as ts from 'typescript';

export async function generateRule(options: { cwd?: string, schema?: string }) {

}

export function compile(fileNames: string[], options: ts.CompilerOptions): void {
  // Create a Program with an in-memory emit
  const createdFiles: any = {}
  const host = ts.createCompilerHost(options);
  host.writeFile = (fileName: string, contents: string) => {
    createdFiles[fileName] = contents
    console.log(fileName);
  }

  // Prepare and emit the d.ts files
  const program = ts.createProgram(fileNames, options, host);
  program.emit();

  // Loop through all the input files
  fileNames.forEach(file => {
    console.log("### JavaScript\n")
    console.log(host.readFile(file));
  })
}
