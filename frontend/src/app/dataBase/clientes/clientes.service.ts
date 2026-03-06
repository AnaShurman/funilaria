import { Injectable } from '@angular/core';
import { SupabaseService } from '../supabase.service';
import { Database } from '../database.types';

export type Cliente = Database['public']['Tables']['Cliente']['Row'];
export type ClienteInsert = Database['public']['Tables']['Cliente']['Insert'];
export type ClienteUpdate = Database['public']['Tables']['Cliente']['Update'];

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  constructor(private supabase: SupabaseService) {}

  async createCliente(cliente: ClienteInsert): Promise<Cliente | null> {
    try {
      const { data, error } = await this.supabase.client
        .from('Cliente')
        .insert(cliente)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating cliente:', error);
      return null;
    }
  }

  async getClienteByTelefone(telefone: string): Promise<Cliente | null> {
    try {
      const { data, error } = await this.supabase.client
        .from('Cliente')
        .select('*')
        .eq('cliente_telefone', telefone)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
      return data;
    } catch (error) {
      console.error('Error getting cliente by telefone:', error);
      return null;
    }
  }

  async getClienteById(id: number): Promise<Cliente | null> {
    try {
      const { data, error } = await this.supabase.client
        .from('Cliente')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting cliente by id:', error);
      return null;
    }
  }

  async updateCliente(id: number, cliente: ClienteUpdate): Promise<Cliente | null> {
    try {
      const { data, error } = await this.supabase.client
        .from('Cliente')
        .update(cliente)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating cliente:', error);
      return null;
    }
  }

  async searchClientes(searchTerm: string): Promise<Cliente[]> {
    try {
      const { data, error } = await this.supabase.client
        .from('Cliente')
        .select('*')
        .or(`cliente_nome.ilike.%${searchTerm}%,cliente_telefone.ilike.%${searchTerm}%`)
        .order('cliente_nome');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching clientes:', error);
      return [];
    }
  }
}

// Made with Bob
