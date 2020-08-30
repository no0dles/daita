import { ForbidRegexDescription } from '../description';

export function forbidRegex(regExp: RegExp): string {
  return <ForbidRegexDescription>{ forbidRegex: { regExp } } as any;
}
