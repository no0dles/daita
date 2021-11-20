import path from 'path';
import fs from 'fs';

export function popPath(directory: string): { start: string; end: string } {
  const parts = directory.split(path.sep);
  return { start: parts.slice(0, parts.length - 1).join(path.sep), end: parts[parts.length - 1] };
}

export function ensurePathExists(directory: string) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}
