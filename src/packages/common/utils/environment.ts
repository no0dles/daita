export function getEnvironmentVariable(key: string): string | null;
export function getEnvironmentVariable(key: string, defaultValue: string): string;
export function getEnvironmentVariable(key: string, defaultValue?: string): string | null {
  if (typeof window !== 'undefined') {
    return (<any>window)[key] ?? defaultValue ?? null;
  } else {
    return process.env[key] ?? defaultValue ?? null;
  }
}

export function getOptionEnvironmentVariable<T extends string>(key: string, allowedValues: T[], fallbackValue: T): T {
  const value = getEnvironmentVariable(key, fallbackValue);
  if (allowedValues.some((allowedValue) => allowedValue === value)) {
    return value as T;
  }
  return fallbackValue;
}

export function getBoolEnvironmentVariable(key: string): boolean | null;
export function getBoolEnvironmentVariable(key: string, defaultValue: boolean): boolean;
export function getBoolEnvironmentVariable(key: string, defaultValue?: boolean): boolean | null {
  const value = getEnvironmentVariable(key);
  if (value) {
    return value === 'true';
  }
  if (defaultValue !== undefined) {
    return defaultValue;
  }
  return null;
}
