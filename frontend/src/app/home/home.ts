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
import { PdfService } from '../services/pdf.service';
import { PerfilService } from '../dataBase/perfil/perfil-service';

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
  
  logoUrl: string | null = null;
  oficinaInfo: any = null;

  constructor(
    private orcamentoService: OrcamentoService,
    private messageService: MessageService,
    private router: Router,
    private pdfService: PdfService,
    private perfilService: PerfilService
  ) {}

  async ngOnInit() {
    await this.loadOficinaInfo();
    await this.carregarOrcamentos();
  }
  
  async loadOficinaInfo(): Promise<void> {
    try {
      this.oficinaInfo = await this.perfilService.getOficinaInfo();
      if (this.oficinaInfo?.logo_path) {
        this.logoUrl = this.perfilService.getImageUrl(this.oficinaInfo.logo_path);
      }
    } catch (error) {
      console.error('Erro ao carregar informações da oficina:', error);
    }
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
    try {
      console.log('📄 Carregando detalhes do orçamento:', orcamento.id);
      
      // Buscar detalhes completos do orçamento (com materiais e serviços)
      const orcamentoCompleto = await this.orcamentoService.obterOrcamento(orcamento.id);
      
      console.log('📋 Orçamento completo:', orcamentoCompleto);
      
      // Preparar dados para o PDF
      const dadosPDF = {
        numeroOrcamento: orcamentoCompleto.numero_orcamento,
        clienteNome: orcamentoCompleto.cliente_nome,
        clienteTelefone: orcamentoCompleto.cliente_telefone,
        clienteEmail: orcamentoCompleto.cliente_email,
        veiculoModelo: orcamentoCompleto.veiculo_modelo,
        veiculoPlaca: orcamentoCompleto.veiculo_placa,
        veiculoAno: orcamentoCompleto.veiculo_ano,
        materiais: orcamentoCompleto.materiais || [],
        servicos: orcamentoCompleto.servicos || [],
        maoDeObra: orcamentoCompleto.mao_de_obra,
        observacoes: orcamentoCompleto.observacoes,
        totalMateriais: orcamentoCompleto.total_materiais,
        totalServicos: orcamentoCompleto.total_servicos,
        valorTotal: orcamentoCompleto.valor_total
      };
      
      console.log('📄 Gerando PDF...');
      
      // Gerar PDF apenas para visualização (sem imprimir)
      await this.pdfService.gerarOrcamentoPDF(
        dadosPDF,
        this.logoUrl || undefined,
        this.oficinaInfo,
        true  // apenasVisualizar = true
      );
      
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: `PDF do orçamento ${orcamento.numero_orcamento} gerado!`,
        life: 3000
      });
    } catch (error) {
      console.error('❌ Erro ao visualizar orçamento:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Não foi possível gerar o PDF do orçamento',
        life: 5000
      });
    }
  }

  async compartilharOrcamentoNoWhatsApp(orcamento: any): Promise<void> {
    try {
      const completo = await this.orcamentoService.obterOrcamento(orcamento.id);
      const dadosPDF = {
        numeroOrcamento: completo.numero_orcamento,
        clienteNome: completo.cliente_nome,
        clienteTelefone: completo.cliente_telefone,
        clienteEmail: completo.cliente_email,
        veiculoModelo: completo.veiculo_modelo,
        veiculoPlaca: completo.veiculo_placa,
        veiculoAno: completo.veiculo_ano,
        materiais: completo.materiais || [],
        servicos: completo.servicos || [],
        maoDeObra: completo.mao_de_obra,
        observacoes: completo.observacoes,
        totalMateriais: completo.total_materiais,
        totalServicos: completo.total_servicos,
        valorTotal: completo.valor_total
      };
      const pdf = await this.pdfService.gerarOrcamentoPDFBlob(dadosPDF, this.oficinaInfo);
      const nomeArquivo = 'orcamento-' + (completo.numero_orcamento || completo.id) + '.pdf';
      const arquivo = new File([pdf], nomeArquivo, { type: 'application/pdf' });
      const navegador = navigator as Navigator & {
        canShare?: (data?: ShareData) => boolean;
        share?: (data?: ShareData) => Promise<void>;
      };

      if (navegador.share && navegador.canShare?.({ files: [arquivo] })) {
        await navegador.share({
          files: [arquivo],
          title: 'Orçamento ' + (completo.numero_orcamento || ''),
          text: 'Orçamento em PDF para encaminhar pelo WhatsApp.'
        });
        return;
      }

      const url = URL.createObjectURL(pdf);
      const link = document.createElement('a');
      link.href = url;
      link.download = nomeArquivo;
      link.click();
      URL.revokeObjectURL(url);
      this.messageService.add({
        severity: 'info',
        summary: 'PDF baixado',
        detail: 'Este navegador não oferece compartilhamento de arquivos. Anexe o PDF baixado no WhatsApp.',
        life: 7000
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      console.error('Erro ao compartilhar PDF do orçamento:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Não foi possível gerar ou compartilhar o PDF deste orçamento.',
        life: 5000
      });
    }
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

  editarOrcamento(orcamento: any): void {
    this.router.navigate(['/novoOrcamento'], { queryParams: { id: orcamento.id } });
  }

  novoOrcamento() {
    this.router.navigate(['/novoOrcamento']);
  }
}


