import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Database } from './database.types';

// Global singleton instance
let supabaseInstance: SupabaseClient<Database> | null = null;

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient<Database>;

  constructor() {
    // Use existing instance or create new one
    if (!supabaseInstance) {
      supabaseInstance = createClient<Database>(
        environment.supabase.url,
        environment.supabase.key,
        {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
          }
        }
      );
    }
    this.supabase = supabaseInstance;
  }

  get client(): SupabaseClient<Database> {
    return this.supabase;
  }

  // Helper methods for common operations
  get auth() {
    return this.supabase.auth;
  }

  get storage() {
    return this.supabase.storage;
  }

  // Example: Get all orcamentos
  async getOrcamentos() {
    const { data, error } = await this.supabase
      .from('orcamentos')
      .select('*');
    
    if (error) throw error;
    return data;
  }

  // Example: Get oficina info
  async getOficinaInfo() {
    const { data, error } = await this.supabase
      .from('oficina')
      .select('*')
      .single();
    
    if (error) throw error;
    return data;
  }
}


