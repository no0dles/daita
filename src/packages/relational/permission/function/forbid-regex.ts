import { ForbidRegexDescription } from '../description/forbid-regex-description';

export function forbidRegex(regExp: RegExp): string {
  return (<ForbidRegexDescription>{ forbidRegex: { regExp } }) as any;
}
