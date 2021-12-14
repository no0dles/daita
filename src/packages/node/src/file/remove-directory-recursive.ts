import { join } from 'path';
import { existsSync, readdirSync, unlinkSync, rmdirSync } from 'fs';

export function removeDirectoryRecursive(target: string) {
  if (!existsSync(target)) {
    return;
  }

  for (const file of readdirSync(target, { withFileTypes: true })) {
    const filePath = join(target, file.name);
    if (file.isDirectory()) {
      removeDirectoryRecursive(filePath);
    } else {
      unlinkSync(filePath);
    }
  }

  rmdirSync(target);
}
