import { Injectable } from '@angular/core';
import { SupabaseService } from '../supabase.service';
import { ClientesService, ClienteInsert } from '../clientes/clientes.service';
import { VeiculosService, VeiculoInsert } from '../veiculos/veiculos.service';

export interface OrcamentoData {
  clienteNome: string;
  clienteTelefone: string;
  clienteEmail?: string;
  veiculoModelo: string;
  veiculoPlaca: string;
  veiculoAno: string;
  materiais: Array<{
    descricao: string;
    quantidade: number;
    valorUnitario: number;
  }>;
  servicos: Array<{
    descricao: string;
    valor: number;
  }>;
  maoDeObra: number;
  observacoes?: string;
  totalMateriais: number;
  totalServicos: number;
  valorTotal: number;
  numeroOrcamento?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrcamentoService {

  constructor(
    private supabase: SupabaseService,
    private clientesService: ClientesService,
    private veiculosService: VeiculosService
  ) { }

  /**
   * Save a new budget to the database
   */
  async salvarOrcamento(dados: OrcamentoData): Promise<any> {
    try {
      // 1. Check if cliente exists or create new one
      let cliente = await this.clientesService.getClienteByTelefone(dados.clienteTelefone);
      
      if (!cliente) {
        // Create new cliente
        const novoCliente: ClienteInsert = {
          nome: dados.clienteNome,
          telefone: dados.clienteTelefone,
          email: dados.clienteEmail || null
        };
        cliente = await this.clientesService.createCliente(novoCliente);
      }

      // 2. Check if veiculo exists or create new one
      let veiculo = await this.veiculosService.getVeiculoByPlaca(dados.veiculoPlaca);
      
      if (!veiculo && cliente) {
        // Create new veiculo
        const novoVeiculo: VeiculoInsert = {
          cliente_id: cliente.id,
          modelo: dados.veiculoModelo,
          placa: dados.veiculoPlaca,
          ano: dados.veiculoAno
        };
        veiculo = await this.veiculosService.createVeiculo(novoVeiculo);
      }

      // 3. Insert main budget record
      const { data: orcamento, error: orcamentoError } = await this.supabase.client
        .from('orcamentos')
        .insert({
          cliente_id: cliente?.id || null,
          veiculo_id: veiculo?.id || null,
          cliente_nome: dados.clienteNome,
          cliente_telefone: dados.clienteTelefone,
          cliente_email: dados.clienteEmail || null,
          veiculo_modelo: dados.veiculoModelo,
          veiculo_placa: dados.veiculoPlaca,
          veiculo_ano: dados.veiculoAno,
          mao_de_obra: dados.maoDeObra,
          total_materiais: dados.totalMateriais,
          total_servicos: dados.totalServicos,
          valor_total: dados.valorTotal,
          observacoes: dados.observacoes || null,
          numero_orcamento: dados.numeroOrcamento || this.gerarNumeroOrcamento(),
          status: 'pendente'
        })
        .select()
        .single();

      if (orcamentoError) throw orcamentoError;

      // 4. Insert materials
      if (dados.materiais && dados.materiais.length > 0) {
        const materiais = dados.materiais.map(material => ({
          orcamento_id: orcamento.id,
          descricao: material.descricao,
          quantidade: material.quantidade,
          valor_unitario: material.valorUnitario
        }));

        const { error: materiaisError } = await this.supabase.client
          .from('orcamento_materiais')
          .insert(materiais as any);

        if (materiaisError) throw materiaisError;
      }

      // 5. Insert services
      if (dados.servicos && dados.servicos.length > 0) {
        const servicos = dados.servicos.map(servico => ({
          orcamento_id: orcamento.id,
          descricao: servico.descricao,
          valor: servico.valor
        }));

        const { error: servicosError } = await this.supabase.client
          .from('orcamento_servicos')
          .insert(servicos);

        if (servicosError) throw servicosError;
      }

      return orcamento;
    } catch (error) {
      console.error('Erro ao salvar orçamento:', error);
      throw error;
    }
  }

  /**
   * Get all budgets
   */
  async listarOrcamentos(): Promise<any[]> {
    const { data, error } = await this.supabase.client
      .from('orcamentos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get a single budget with all details
   */
  async obterOrcamento(id: string): Promise<any> {
    const { data: orcamento, error: orcamentoError } = await this.supabase.client
      .from('orcamentos')
      .select('*')
      .eq('id', id)
      .single();

    if (orcamentoError) throw orcamentoError;

    // Get materials
    const { data: materiais } = await this.supabase.client
      .from('orcamento_materiais')
      .select('*')
      .eq('orcamento_id', id);

    // Get services
    const { data: servicos } = await this.supabase.client
      .from('orcamento_servicos')
      .select('*')
      .eq('orcamento_id', id);

    return {
      ...orcamento,
      materiais: materiais || [],
      servicos: servicos || []
    };
  }

  /**
   * Update budget status
   */
  async atualizarStatus(id: string, status: string): Promise<void> {
    const { error } = await this.supabase.client
      .from('orcamentos')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
  }

  /**
   * Delete a budget
   */
  async deletarOrcamento(id: string): Promise<void> {
    const { error } = await this.supabase.client
      .from('orcamentos')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  /**
   * Generate budget number
   */
  private gerarNumeroOrcamento(): string {
    const data = new Date();
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${ano}${mes}${dia}-${random}`;
  }
}


