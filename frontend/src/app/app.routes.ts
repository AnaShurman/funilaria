import { Routes } from '@angular/router';
import { Home } from './home/home';
import { NovoOrcamento } from './novo-orcamento/novo-orcamento';
import { Perfil } from './perfil/perfil';
import { Login } from './login/login';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
    title: 'Entrar | Funilaria',
  },
  {
    path: '',
    component: Home,
    title: 'Dashboard | Funilaria',
    canActivate: [authGuard],
  },
  {
    path: 'novoOrcamento',
    component: NovoOrcamento,
    title: 'Novo Orçamento | Funilaria',
    canActivate: [authGuard],
  },
  {
    path: 'perfil',
    component: Perfil,
    title: 'Perfil | Funilaria',
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
