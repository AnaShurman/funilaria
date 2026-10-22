import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { Sidebar } from './sidebar/sidebar';
import { SupabaseService } from './dataBase/supabase.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Sidebar],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private authSubscription?: ReturnType<SupabaseService['auth']['onAuthStateChange']>['data']['subscription'];
  private navigationSubscription?: Subscription;

  constructor(private supabase: SupabaseService, private router: Router) {}

  ngOnInit(): void {
    this.refreshSession();
    this.authSubscription = this.supabase.auth.onAuthStateChange((_event, session) => {
      this.isAuthenticated = !!session;
      if (!session && this.router.url !== '/login') {
        void this.router.navigateByUrl('/login');
      }
    }).data.subscription;

    this.navigationSubscription = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => this.refreshSession());
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
    this.navigationSubscription?.unsubscribe();
  }

  private async refreshSession(): Promise<void> {
    const { data } = await this.supabase.auth.getSession();
    this.isAuthenticated = !!data.session;
  }
}
