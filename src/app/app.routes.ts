import { Routes } from '@angular/router';
import { Profile } from './components/profile/profile';
import { Home } from './components/home/home';

export const routes: Routes = [
  {
    path: 'microsoft-auth',
    loadComponent: () =>
      import('./components/microsoft-todo/microsoft-auth').then((m) => m.MicrosoftAuth),
  },
  {
    path: '',
    component: Home,
    pathMatch: 'full',
  },
  {
    path: 'profile',
    component: Profile,
    pathMatch: 'full',
  },
];
