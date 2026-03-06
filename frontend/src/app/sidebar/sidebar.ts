import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss'],
})
export class Sidebar {
  menuItems = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      route: '/',
    },
    {
      label: 'Novo Orçamento',
      icon: 'pi pi-plus-circle',
      route: '/novoOrcamento',
    },
    {
      label: 'Perfil',
      icon: 'pi pi-cog',
      route: '/perfil',
    },
  ];

  constructor(private router: Router) {}

  isActive(route: string): boolean {
    return this.router.url === route;
  }
}


