---
id: design-goals
title: Design goals
sidebar_label: Design goals
---
## Design goals

### 1. Keep the flexibility of sql
Daita should allow the support of all sql functionality without using any form of `raw` sql input.

### 2. strict typing
Daita should give as much of type assistance as possible during development.
The used sql syntax should be as type safe as possible. 
There are cases where complete type safety is not possible, but linting rules should cover them.

### 3. No build extensions
Todays development tools are complex enough.
Daita should never extend the build process with an additional build step.
Every functionality should work with existing tools like the typescript compiler or eslint.

### 4. Dependencies
Daita should contain as less of dependencies as possible. 
A used dependency should not be exposed by daita to prevent any instability or compile issues.
Runtime dependencies should be picked with a mind to bundle size and installation time.

### 5. Backward compatibility for stable features
Daita should add new functionality always in a backward compatible way.
For every deprecation there needs to be a migration path.
