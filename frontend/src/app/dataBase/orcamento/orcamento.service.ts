import { Injectable } from '@angular/core';
import { SupabaseService } from '../supabase.service';
import { ClientesService, ClienteInsert } from '../clientes/clientes.service';
import { VeiculosService, VeiculoInsert } from '../veiculos/veiculos.service';

export interface OrcamentoData {
  clienteNome: string;
  clienteTelefone?: string;
  clienteEmail?: string;
  veiculoModelo?: string;
  veiculoPlaca?: string;
  veiculoAno?: string;
  materiais: Array<{
    descricao: string;
    quantidade: number;
    valorUnitario: number;
  }>;
  servicos: Array<{
    descricao: string;
    valor: number;
  }>;
  maoDeObra?: number | null;
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
      console.log('=== INICIANDO SALVAMENTO ===');
      console.log('Dados recebidos:', dados);
      
      // 1. Only look up or create a client when a phone number is provided.
      let cliente = null;
      const telefone = dados.clienteTelefone?.trim();
      if (telefone) {
        cliente = await this.clientesService.getClienteByTelefone(telefone);
        if (!cliente) {
          const novoCliente: ClienteInsert = {
            cliente_nome: dados.clienteNome,
            cliente_telefone: telefone,
            cliente_email: dados.clienteEmail || null
          };
          cliente = await this.clientesService.createCliente(novoCliente);
        }
      }

      // 2. Only look up or create a vehicle when all vehicle details are provided.
      let veiculo = null;
      const modelo = dados.veiculoModelo?.trim();
      const placa = dados.veiculoPlaca?.trim();
      const ano = dados.veiculoAno?.trim();
      if (cliente && modelo && placa && ano) {
        veiculo = await this.veiculosService.getVeiculoByPlaca(placa);
        if (!veiculo) {
          const novoVeiculo: VeiculoInsert = {
            cliente_id: cliente.id,
            veiculo_modelo: modelo,
            veiculo_placa: placa,
            veiculo_ano: ano
          };
          veiculo = await this.veiculosService.createVeiculo(novoVeiculo);
        }
      }

      // 3. Insert main budget record
      const { data: orcamento, error: orcamentoError } = await this.supabase.client
        .from('orcamentos')
        .insert({
          cliente_id: cliente?.id || null,
          veiculo_id: veiculo?.id || null,
          cliente_nome: dados.clienteNome,
          cliente_telefone: dados.clienteTelefone?.trim() || null,
          cliente_email: dados.clienteEmail || null,
          veiculo_modelo: dados.veiculoModelo?.trim() || null,
          veiculo_placa: dados.veiculoPlaca?.trim() || null,
          veiculo_ano: dados.veiculoAno?.trim() || null,
          mao_de_obra: dados.maoDeObra || 0,
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
      const materiaisValidos = (dados.materiais || []).filter(material => material.descricao?.trim());
      if (materiaisValidos.length > 0) {
        const materiais = materiaisValidos.map(material => ({
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
      const servicosValidos = (dados.servicos || []).filter(servico => servico.descricao?.trim());
      if (servicosValidos.length > 0) {
        const servicos = servicosValidos.map(servico => ({
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

  /** Update an existing budget and replace its materials and services. */
  async atualizarOrcamento(id: string, dados: OrcamentoData): Promise<void> {
    const { error: updateError } = await this.supabase.client
      .from('orcamentos')
      .update({
        cliente_nome: dados.clienteNome,
        cliente_telefone: dados.clienteTelefone?.trim() || null,
        cliente_email: dados.clienteEmail || null,
        veiculo_modelo: dados.veiculoModelo?.trim() || null,
        veiculo_placa: dados.veiculoPlaca?.trim() || null,
        veiculo_ano: dados.veiculoAno?.trim() || null,
        mao_de_obra: dados.maoDeObra || 0,
        total_materiais: dados.totalMateriais,
        total_servicos: dados.totalServicos,
        valor_total: dados.valorTotal,
        observacoes: dados.observacoes || null
      })
      .eq('id', id);
    if (updateError) throw updateError;

    const { error: materiaisDeleteError } = await this.supabase.client
      .from('orcamento_materiais').delete().eq('orcamento_id', id);
    if (materiaisDeleteError) throw materiaisDeleteError;

    const { error: servicosDeleteError } = await this.supabase.client
      .from('orcamento_servicos').delete().eq('orcamento_id', id);
    if (servicosDeleteError) throw servicosDeleteError;

    const materiais = (dados.materiais || [])
      .filter(item => item.descricao?.trim())
      .map(item => ({
        orcamento_id: id,
        descricao: item.descricao.trim(),
        quantidade: item.quantidade || 1,
        valor_unitario: item.valorUnitario || 0
      }));
    if (materiais.length) {
      const { error } = await this.supabase.client.from('orcamento_materiais').insert(materiais as any);
      if (error) throw error;
    }

    const servicos = (dados.servicos || [])
      .filter(item => item.descricao?.trim())
      .map(item => ({ orcamento_id: id, descricao: item.descricao.trim(), valor: item.valor || 0 }));
    if (servicos.length) {
      const { error } = await this.supabase.client.from('orcamento_servicos').insert(servicos);
      if (error) throw error;
    }
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


