import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../dataBase/supabase.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private supabase: SupabaseService,
    private router: Router,
  ) {}

  async signIn(email: string, password: string): Promise<void> {
    const { error } = await this.supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) throw error;
    await this.router.navigateByUrl('/');
  }

  async signOut(): Promise<void> {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
    await this.router.navigateByUrl('/login');
  }

  async hasSession(): Promise<boolean> {
    const { data, error } = await this.supabase.auth.getSession();
    return !error && !!data.session;
  }
}
