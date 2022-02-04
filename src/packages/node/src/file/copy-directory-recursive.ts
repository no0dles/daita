import { mkdirSync, readdirSync, copyFileSync } from 'fs';
import { join, relative } from 'path';

export function copyDirectoryRecursive(sourceDir: string, targetDir: string, filter: (file: string) => boolean) {
  return copyDirectoryRecursiveInternal(sourceDir, sourceDir, targetDir, filter);
}

function copyDirectoryRecursiveInternal(
  rootDir: string,
  sourceDir: string,
  targetDir: string,
  filter: (file: string) => boolean,
) {
  mkdirSync(targetDir, { recursive: true });
  for (const file of readdirSync(sourceDir, { withFileTypes: true })) {
    const srcFile = join(sourceDir, file.name);
    const targetFile = join(targetDir, file.name);
    const isFiltered = filter(relative(rootDir, srcFile));
    if (!isFiltered) {
      continue;
    }

    if (file.isDirectory()) {
      copyDirectoryRecursiveInternal(rootDir, srcFile, targetFile, filter);
    } else {
      copyFileSync(srcFile, targetFile);
    }
  }
}
