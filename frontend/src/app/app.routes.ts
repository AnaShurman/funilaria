import {Routes} from '@angular/router';
import {Home} from './home/home';
import { NovoOrcamento } from './novo-orcamento/novo-orcamento';
import { Perfil } from './perfil/perfil';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'Home page',
  },
  {
    path: 'novoOrcamento',
    component: NovoOrcamento,
    title: 'Novo Orçamento',
  },
  {
    path: 'perfil',
    component: Perfil,
    title: 'Perfil',
  },
];
