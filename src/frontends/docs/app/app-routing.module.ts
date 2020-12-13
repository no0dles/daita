import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'intro' },
  {
    path: 'daita',
    loadChildren: () => import('./modules/daita.module').then((m) => m.DaitaModule),
  },
  {
    path: 'getting-started',
    loadChildren: () => import('./modules/getting-started.module').then((m) => m.GettingStartedModule),
  },
  {
    path: 'intro',
    loadChildren: () => import('./modules/intro.module').then((m) => m.IntroModule),
  },
  {
    path: 'packages',
    loadChildren: () => import('./modules/packages.module').then((m) => m.PackagesModule),
  },
  {
    path: 'containers',
    loadChildren: () => import('./modules/containers.module').then((m) => m.ContainersModule),
  },
  {
    path: 'adapters',
    loadChildren: () => import('./modules/adapter.module').then((m) => m.AdapterModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { paramsInheritanceStrategy: 'always' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
