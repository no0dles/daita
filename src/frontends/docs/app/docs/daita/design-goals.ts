import { Section } from '../../section';

export const designGoalsSections: Section[] = [
  {
    id: 'design-goal',
    title: 'Design Goals',
    description:
      '### 1. Keep the flexibility of sql\n' +
      'Daita should allow the support of all sql functionality without using any form of `raw` sql input.\n' +
      '\n' +
      '### 2. strict typing\n' +
      'Daita should give as much of type assistance as possible during development.\n' +
      'The used sql syntax should be as type safe as possible. \n' +
      'There are cases where complete type safety is not possible, but linting rules should cover them.\n' +
      '\n' +
      '### 3. No build extensions\n' +
      'Todays development tools are complex enough.\n' +
      'Daita should never extend the build process with an additional build step.\n' +
      'Every functionality should work with existing tools like the typescript compiler or eslint.\n' +
      '\n' +
      '### 4. Dependencies\n' +
      'Daita should contain as less of dependencies as possible. \n' +
      'A used dependency should not be exposed by daita to prevent any instability or compile issues.\n' +
      'Runtime dependencies should be picked with a mind to bundle size and installation time.\n' +
      '\n' +
      '### 5. Backward compatibility for stable features\n' +
      'Daita should add new functionality always in a backward compatible way.\n' +
      'For every deprecation there needs to be a migration path.',
  },
];
