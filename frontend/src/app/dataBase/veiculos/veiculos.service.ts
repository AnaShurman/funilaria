import { Injectable } from '@angular/core';
import { SupabaseService } from '../supabase.service';
import { Database } from '../database.types';

export type Veiculo = Database['public']['Tables']['veiculos']['Row'];
export type VeiculoInsert = Database['public']['Tables']['veiculos']['Insert'];
export type VeiculoUpdate = Database['public']['Tables']['veiculos']['Update'];

@Injectable({
  providedIn: 'root'
})
export class VeiculosService {
  constructor(private supabase: SupabaseService) {}

  async createVeiculo(veiculo: VeiculoInsert): Promise<Veiculo | null> {
    try {
      const { data, error } = await this.supabase.client
        .from('veiculos')
        .insert(veiculo)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating veiculo:', error);
      return null;
    }
  }

  async getVeiculoByPlaca(placa: string): Promise<Veiculo | null> {
    try {
      const { data, error } = await this.supabase.client
        .from('veiculos')
        .select('*')
        .eq('placa', placa)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Error getting veiculo by placa:', error);
      return null;
    }
  }

  async getVeiculosByClienteId(clienteId: string): Promise<Veiculo[]> {
    try {
      const { data, error } = await this.supabase.client
        .from('veiculos')
        .select('*')
        .eq('cliente_id', clienteId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting veiculos by cliente:', error);
      return [];
    }
  }

  async updateVeiculo(id: string, veiculo: VeiculoUpdate): Promise<Veiculo | null> {
    try {
      const { data, error } = await this.supabase.client
        .from('veiculos')
        .update(veiculo)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating veiculo:', error);
      return null;
    }
  }

  async searchVeiculos(searchTerm: string): Promise<Veiculo[]> {
    try {
      const { data, error } = await this.supabase.client
        .from('veiculos')
        .select('*')
        .or(`modelo.ilike.%${searchTerm}%,placa.ilike.%${searchTerm}%,marca.ilike.%${searchTerm}%`)
        .order('modelo');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching veiculos:', error);
      return [];
    }
  }
}

// Made with Bob
