import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { OrcamentoService } from '../dataBase/orcamento/orcamento.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    CardModule,
    TagModule,
    InputTextModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class Home implements OnInit {
  orcamentos: any[] = [];
  loading: boolean = true;
  totalOrcamentos: number = 0;
  valorTotalGeral: number = 0;
  orcamentosPendentes: number = 0;
  
  // Métricas mensais
  orcamentosMesAtual: number = 0;
  valorMesAtual: number = 0;
  orcamentosMesAnterior: number = 0;
  valorMesAnterior: number = 0;
  crescimentoOrcamentos: number = 0;
  crescimentoValor: number = 0;

  constructor(
    private orcamentoService: OrcamentoService,
    private messageService: MessageService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.carregarOrcamentos();
  }

  async carregarOrcamentos() {
    try {
      this.loading = true;
      this.orcamentos = await this.orcamentoService.listarOrcamentos();
      this.calcularEstatisticas();
    } catch (error) {
      console.error('Erro ao carregar orçamentos:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Não foi possível carregar os orçamentos'
      });
    } finally {
      this.loading = false;
    }
  }

  calcularEstatisticas() {
    this.totalOrcamentos = this.orcamentos.length;
    this.valorTotalGeral = this.orcamentos.reduce((sum, orc) => sum + (orc.valor_total || 0), 0);
    this.orcamentosPendentes = this.orcamentos.filter(orc => orc.status === 'pendente').length;
    
    // Calcular métricas mensais
    const agora = new Date();
    const mesAtual = agora.getMonth();
    const anoAtual = agora.getFullYear();
    
    // Mês anterior
    const mesAnterior = mesAtual === 0 ? 11 : mesAtual - 1;
    const anoMesAnterior = mesAtual === 0 ? anoAtual - 1 : anoAtual;
    
    // Filtrar orçamentos do mês atual
    const orcamentosMesAtual = this.orcamentos.filter(orc => {
      const data = new Date(orc.created_at);
      return data.getMonth() === mesAtual && data.getFullYear() === anoAtual;
    });
    
    // Filtrar orçamentos do mês anterior
    const orcamentosMesAnterior = this.orcamentos.filter(orc => {
      const data = new Date(orc.created_at);
      return data.getMonth() === mesAnterior && data.getFullYear() === anoMesAnterior;
    });
    
    this.orcamentosMesAtual = orcamentosMesAtual.length;
    this.valorMesAtual = orcamentosMesAtual.reduce((sum, orc) => sum + (orc.valor_total || 0), 0);
    
    this.orcamentosMesAnterior = orcamentosMesAnterior.length;
    this.valorMesAnterior = orcamentosMesAnterior.reduce((sum, orc) => sum + (orc.valor_total || 0), 0);
    
    // Calcular crescimento percentual
    this.crescimentoOrcamentos = this.orcamentosMesAnterior > 0
      ? ((this.orcamentosMesAtual - this.orcamentosMesAnterior) / this.orcamentosMesAnterior) * 100
      : 0;
      
    this.crescimentoValor = this.valorMesAnterior > 0
      ? ((this.valorMesAtual - this.valorMesAnterior) / this.valorMesAnterior) * 100
      : 0;
  }
  
  getNomeMesAtual(): string {
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                   'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    return meses[new Date().getMonth()];
  }
  
  getCrescimentoClass(valor: number): string {
    if (valor > 0) return 'crescimento-positivo';
    if (valor < 0) return 'crescimento-negativo';
    return 'crescimento-neutro';
  }
  
  getCrescimentoIcon(valor: number): string {
    if (valor > 0) return 'pi-arrow-up';
    if (valor < 0) return 'pi-arrow-down';
    return 'pi-minus';
  }

  formatarMoeda(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor || 0);
  }

  formatarData(data: string): string {
    if (!data) return '-';
    return new Date(data).toLocaleDateString('pt-BR');
  }

  getSeverity(status: string): "success" | "secondary" | "info" | "warn" | "danger" | "contrast" | null | undefined {
    switch (status) {
      case 'pendente':
        return 'warn';
      case 'aprovado':
        return 'success';
      case 'rejeitado':
        return 'danger';
      default:
        return 'info';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'pendente':
        return 'Pendente';
      case 'aprovado':
        return 'Aprovado';
      case 'rejeitado':
        return 'Rejeitado';
      default:
        return status;
    }
  }

  async visualizarOrcamento(orcamento: any) {
    // TODO: Implementar visualização detalhada
    this.messageService.add({
      severity: 'info',
      summary: 'Em desenvolvimento',
      detail: `Visualizar orçamento ${orcamento.numero_orcamento}`
    });
  }

  async deletarOrcamento(id: string) {
    if (confirm('Tem certeza que deseja deletar este orçamento?')) {
      try {
        await this.orcamentoService.deletarOrcamento(id);
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Orçamento deletado com sucesso'
        });
        await this.carregarOrcamentos();
      } catch (error) {
        console.error('Erro ao deletar orçamento:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível deletar o orçamento'
        });
      }
    }
  }

  novoOrcamento() {
    this.router.navigate(['/novoOrcamento']);
  }
}


