import { Routes } from '@angular/router';

import { DEMO_ROUTES } from './router';
import { DEMOComponent } from './_demo/demo.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/docs/introduce' },
  ...DEMO_ROUTES,
  { path: 'docs', loadChildren: () => import('./docs/index.module').then(m => m.DmcDocsModule)},
  { path: 'demo', component: DEMOComponent },
  { path: '**', redirectTo: '/docs/introduce', pathMatch: 'full' }
];
