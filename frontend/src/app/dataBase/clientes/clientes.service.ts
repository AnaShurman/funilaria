import { Injectable } from '@angular/core';
import { SupabaseService } from '../supabase.service';
import { Database } from '../database.types';

export type Cliente = Database['public']['Tables']['clientes']['Row'];
export type ClienteInsert = Database['public']['Tables']['clientes']['Insert'];
export type ClienteUpdate = Database['public']['Tables']['clientes']['Update'];

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  constructor(private supabase: SupabaseService) {}

  async createCliente(cliente: ClienteInsert): Promise<Cliente | null> {
    try {
      const { data, error } = await this.supabase.client
        .from('clientes')
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
        .from('clientes')
        .select('*')
        .eq('telefone', telefone)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
      return data;
    } catch (error) {
      console.error('Error getting cliente by telefone:', error);
      return null;
    }
  }

  async getClienteById(id: string): Promise<Cliente | null> {
    try {
      const { data, error } = await this.supabase.client
        .from('clientes')
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

  async updateCliente(id: string, cliente: ClienteUpdate): Promise<Cliente | null> {
    try {
      const { data, error } = await this.supabase.client
        .from('clientes')
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
        .from('clientes')
        .select('*')
        .or(`nome.ilike.%${searchTerm}%,telefone.ilike.%${searchTerm}%`)
        .order('nome');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching clientes:', error);
      return [];
    }
  }
}

// Made with Bob
