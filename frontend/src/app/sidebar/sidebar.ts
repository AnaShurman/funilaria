import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss'],
})
export class Sidebar {
  isMenuOpen = false;

  menuItems = [
    { label: 'Dashboard', icon: 'pi pi-home', route: '/' },
    { label: 'Novo Orçamento', icon: 'pi pi-plus-circle', route: '/novoOrcamento' },
    { label: 'Perfil', icon: 'pi pi-cog', route: '/perfil' },
  ];

  constructor(private router: Router, private auth: AuthService) {}

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  async logout(): Promise<void> {
    await this.auth.signOut();
  }
}
