export function parseJson(value: string): any {
  if (!value) {
    return null;
  }

  return JSON.parse(value, (name, value) => {
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)) {
      return new Date(value);
    }
    return value;
  });
}
