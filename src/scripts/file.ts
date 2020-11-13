import path from 'path';
import fs from 'fs';

export interface FileInfo {
  isFile: true;
  fileName: string;
}
export interface DirectoryInfo {
  isFile: false;
  directory: string;
}
export type FileOrDirectoryInfo = FileInfo | DirectoryInfo;

export function* getFiles(
  directory: string,
  options?: { selector?: (fileOrDir: FileInfo) => boolean },
): Iterable<FileInfo> {
  for (const fileOrDir of getFilesAndDirectories(directory, {
    selector: (info) => !info.isFile || !options?.selector || options.selector(info),
  })) {
    if (fileOrDir.isFile) {
      yield fileOrDir as FileInfo;
    }
  }
}

export function* getDirectories(
  directory: string,
  options?: { selector?: (fileOrDir: DirectoryInfo) => boolean },
): Iterable<DirectoryInfo> {
  for (const fileOrDir of getFilesAndDirectories(directory, {
    selector: (info) => !info.isFile && (!options?.selector || options.selector(info)),
  })) {
    yield fileOrDir as DirectoryInfo;
  }
}

export interface FileAndDirectoryOptions {
  selector?: (fileOrDir: FileOrDirectoryInfo) => boolean;
}

export function* getFilesAndDirectories(
  directoryPath: string,
  options?: FileAndDirectoryOptions,
): Iterable<FileOrDirectoryInfo> {
  for (const entry of fs.readdirSync(directoryPath, { withFileTypes: true })) {
    if (entry.isFile()) {
      const fileName = path.join(directoryPath, entry.name);
      if (options?.selector && !options?.selector({ isFile: true, fileName })) {
        continue;
      }
      yield { isFile: true, fileName };
    } else {
      const directory = path.join(directoryPath, entry.name);
      if (options?.selector && !options?.selector({ isFile: false, directory })) {
        continue;
      }

      yield { isFile: false, directory };
      for (const file of getFilesAndDirectories(path.join(directoryPath, entry.name), options)) {
        yield file;
      }
    }
  }
}

export function copyDir(from: string, to: string, options?: FileAndDirectoryOptions) {
  for (const file of getFilesAndDirectories(from, options)) {
    if (file.isFile) {
      const relativePath = path.relative(from, file.fileName);
      const toPath = path.join(to, relativePath);
      const dirName = path.dirname(toPath);
      if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName, { recursive: true });
      }
      fs.copyFileSync(file.fileName, toPath);
    } else {
      const relativePath = path.relative(from, file.directory);
      const toPath = path.join(to, relativePath);
      if (!fs.existsSync(toPath)) {
        fs.mkdirSync(toPath, { recursive: true });
      }
    }
  }
}
