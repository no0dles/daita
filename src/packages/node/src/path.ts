import { sep } from 'path';
import { existsSync, mkdirSync } from 'fs';

export function popPath(directory: string): { start: string; end: string } {
  const parts = directory.split(sep);
  return { start: parts.slice(0, parts.length - 1).join(sep), end: parts[parts.length - 1] };
}

export function ensurePathExists(directory: string) {
  if (!existsSync(directory)) {
    mkdirSync(directory, { recursive: true });
  }
}
