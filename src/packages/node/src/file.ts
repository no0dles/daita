import fs from 'fs';
import yaml from 'yaml';

export function writePrettyJsonFile(file: string, content: any) {
  fs.writeFileSync(file, JSON.stringify(content, null, 2));
}

export function readJsonFile<T>(file: string): T | null;
export function readJsonFile<T>(file: string, defaultValue: T): T;
export function readJsonFile<T>(file: string, defaultValue?: T): T | null {
  if (!fs.existsSync(file)) {
    return defaultValue || null;
  }

  const content = JSON.parse(fs.readFileSync(file).toString());
  return content as T;
}

export function readYamlFile<T>(file: string): T | null;
export function readYamlFile<T>(file: string, defaultValue: T): T;
export function readYamlFile<T>(file: string, defaultValue?: T): T | null {
  if (!fs.existsSync(file)) {
    return defaultValue || null;
  }

  const content = yaml.parse(fs.readFileSync(file).toString());
  return content as T;
}

export function writeYamlFile(file: string, content: any) {
  fs.writeFileSync(file, yaml.stringify(content, { indent: 2 }));
}

export function writeFileIfNotExists(file: string, content: string): boolean {
  if (fs.existsSync(file)) {
    return false;
  }

  fs.writeFileSync(file, content);
  return true;
}
