import { Section } from '../../section';

export const designGoalsSections: Section[] = [
  {
    id: 'design-goal',
    title: 'Design Goals',
    sections: [
      {
        id: 'flexibile',
        title: 'Keep the flexibility of sql',
        description:
          'Daita should allow the support of all sql functionality without using any form of `raw` sql input.',
      },
      {
        id: 'typing',
        title: 'Strict typing',
        description:
          'Daita should give as much of type assistance as possible during development.\n' +
          'The used sql syntax should be as type safe as possible. \n' +
          'There are cases where complete type safety is not possible, but linting rules should cover them.',
      },
      {
        id: 'build',
        title: 'No build extensions',
        description:
          'Todays development tools are complex enough.\n' +
          'Daita should never extend the build process with an additional build step.\n' +
          'Every functionality should work with existing tools like the typescript compiler or eslint.',
      },
      {
        id: 'dependencies',
        title: 'Dependencies',
        description:
          'Daita should contain as less of dependencies as possible. \n' +
          'A used dependency should not be exposed by daita to prevent any instability or compile issues.\n' +
          'Runtime dependencies should be picked with a mind to bundle size and installation time.',
      },
      {
        id: 'compatibility',
        title: 'Backward compatibility for stable features',
        description:
          'Daita should add new functionality always in a backward compatible way.\n' +
          'For every deprecation there needs to be a migration path.',
      },
    ],
  },
];
