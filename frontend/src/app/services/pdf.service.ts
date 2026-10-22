import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }

  async gerarOrcamentoPDF(dados: any, logoUrl?: string, oficinaInfo?: any, apenasVisualizar: boolean = false): Promise<void> {
    // Criar um elemento HTML temporário para o conteúdo do PDF
    const conteudo = this.criarConteudoHTML(dados, logoUrl, oficinaInfo);
    
    // Criar uma nova janela para impressão/visualização
    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
      printWindow.document.write(conteudo);
      printWindow.document.close();
      
      // Se não for apenas visualizar, aguardar e imprimir
      if (!apenasVisualizar) {
        // Aguardar o carregamento das imagens antes de imprimir
        // Usar setTimeout para não bloquear a thread principal
        setTimeout(() => {
          if (printWindow && !printWindow.closed) {
            printWindow.print();
          }
        }, 500);
      }
    }
    
    // Retornar imediatamente sem esperar o fechamento da janela
    return Promise.resolve();
  }

  private criarConteudoHTML(dados: any, logoUrl?: string, oficinaInfo?: any): string {
    const dataAtual = new Date().toLocaleDateString('pt-BR');

    // Dados da oficina
    const nomeOficina = oficinaInfo?.nome || 'Funilaria Shurman';
    const telefoneOficina = oficinaInfo?.telefone || '';
    const emailOficina = oficinaInfo?.email || '';
    const enderecoCompleto = this.montarEnderecoCompleto(oficinaInfo);
    const cnpjOficina = oficinaInfo?.cnpj || '';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Orçamento - ${this.texto(dados.clienteNome)}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: Arial, sans-serif;
            padding: 40px;
            color: #333;
            background: white;
          }
          
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #007bff;
          }
          
          .logo {
            max-width: 250px;
            max-height: 150px;
            object-fit: contain;
          }
          
          .company-info {
            text-align: right;
          }
          
          .company-info h1 {
            color: #007bff;
            font-size: 24px;
            margin-bottom: 5px;
          }
          
          .company-info p {
            font-size: 12px;
            color: #666;
          }
          
          .title {
            text-align: center;
            margin: 30px 0;
          }
          
          .title h2 {
            color: #333;
            font-size: 28px;
            margin-bottom: 10px;
          }
          
          .title p {
            color: #666;
            font-size: 14px;
          }
          
          .section {
            margin-bottom: 25px;
            page-break-inside: avoid;
          }
          
          .section-title {
            background-color: #f8f9fa;
            padding: 10px 15px;
            border-left: 4px solid #007bff;
            font-size: 16px;
            font-weight: bold;
            color: #333;
            margin-bottom: 15px;
          }
          
          .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-bottom: 15px;
          }
          
          .info-item {
            padding: 10px;
            background-color: #f8f9fa;
            border-radius: 5px;
          }
          
          .info-item label {
            display: block;
            font-size: 11px;
            color: #666;
            text-transform: uppercase;
            margin-bottom: 5px;
            font-weight: bold;
          }
          
          .info-item span {
            display: block;
            font-size: 14px;
            color: #333;
          }
          
          .full-width {
            grid-column: 1 / -1;
          }
          
          .description-box {
            padding: 15px;
            background-color: #f8f9fa;
            border-radius: 5px;
            min-height: 100px;
            white-space: pre-wrap;
            line-height: 1.6;
          }
          
          .valor-destaque {
            text-align: center;
            padding: 20px;
            background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
            color: white;
            border-radius: 10px;
            margin: 30px 0;
          }
          
          .valor-destaque label {
            display: block;
            font-size: 14px;
            margin-bottom: 10px;
            opacity: 0.9;
          }
          
          .valor-destaque .valor {
            font-size: 36px;
            font-weight: bold;
          }
          
          .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 2px solid #e0e0e0;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
          
          .assinatura {
            margin-top: 60px;
            display: flex;
            justify-content: space-around;
          }
          
          .assinatura-box {
            text-align: center;
            width: 40%;
          }
          
          .assinatura-linha {
            border-top: 2px solid #333;
            margin-bottom: 10px;
          }

          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }

          .items-table th {
            background-color: #007bff;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: bold;
            border: 1px solid #0056b3;
          }

          .items-table td {
            padding: 10px 12px;
            border: 1px solid #e0e0e0;
          }

          .items-table tbody tr:nth-child(even) {
            background-color: #f8f9fa;
          }

          .items-table tbody tr:hover {
            background-color: #e9ecef;
          }

          .items-table tfoot tr.total-row {
            background-color: #f0f0f0;
            font-weight: bold;
          }

          .items-table tfoot td {
            padding: 12px;
            border-top: 2px solid #007bff;
          }

          .mao-obra-box {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 20px;
            background-color: #f8f9fa;
            border-radius: 5px;
            border-left: 4px solid #007bff;
            font-size: 16px;
          }

          .mao-obra-box strong {
            color: #007bff;
            font-size: 20px;
          }
          
          @media print {
            body {
              padding: 20px;
            }
            
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          ${logoUrl ? `<img src="${logoUrl}" alt="Logo" class="logo" />` : '<div></div>'}
          <div class="company-info">
            <h1>${nomeOficina}</h1>
            ${cnpjOficina ? `<p>CNPJ: ${cnpjOficina}</p>` : ''}
            ${telefoneOficina ? `<p>Tel: ${telefoneOficina}</p>` : ''}
            ${emailOficina ? `<p>Email: ${emailOficina}</p>` : ''}
            ${enderecoCompleto ? `<p>${enderecoCompleto}</p>` : ''}
            <p style="margin-top: 10px; font-weight: bold;">Orçamento Nº: ${this.gerarNumeroOrcamento()}</p>
            <p>Data: ${dataAtual}</p>
          </div>
        </div>

        <div class="title">
          <h2>ORÇAMENTO</h2>
          <p>Proposta de Serviços Automotivos</p>
        </div>

        <div class="section">
          <div class="section-title">Dados do Cliente</div>
          <div class="info-grid">
            <div class="info-item">
              <label>Nome</label>
              <span>${this.texto(dados.clienteNome)}</span>
            </div>
            <div class="info-item">
              <label>Telefone</label>
              <span>${this.texto(dados.clienteTelefone)}</span>
            </div>
            ${dados.clienteEmail ? `
            <div class="info-item full-width">
              <label>E-mail</label>
              <span>${this.texto(dados.clienteEmail)}</span>
            </div>
            ` : ''}
          </div>
        </div>

        <div class="section">
          <div class="section-title">Dados do Veículo</div>
          <div class="info-grid">
            <div class="info-item">
              <label>Modelo</label>
              <span>${this.texto(dados.veiculoModelo)}</span>
            </div>
            <div class="info-item">
              <label>Placa</label>
              <span>${this.texto(dados.veiculoPlaca)}</span>
            </div>
            <div class="info-item">
              <label>Ano</label>
              <span>${this.texto(dados.veiculoAno)}</span>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Materiais</div>
          <table class="items-table">
            <thead>
              <tr>
                <th>Descrição</th>
                <th style="text-align: center;">Qtd</th>
                <th style="text-align: right;">Valor Unit.</th>
                <th style="text-align: right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${dados.materiais?.map((material: any) => `
                <tr>
                  <td>${this.texto(material.descricao)}</td>
                  <td style="text-align: center;">${this.texto(material.quantidade)}</td>
                  <td style="text-align: right;">${this.formatarMoeda(material.valorUnitario)}</td>
                  <td style="text-align: right;">${this.formatarMoeda(material.quantidade * material.valorUnitario)}</td>
                </tr>
              `).join('') || '<tr><td colspan="4">Nenhum material cadastrado</td></tr>'}
            </tbody>
            <tfoot>
              <tr class="total-row">
                <td colspan="3" style="text-align: right;"><strong>Total Materiais:</strong></td>
                <td style="text-align: right;"><strong>${this.formatarMoeda(dados.totalMateriais || 0)}</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div class="section">
          <div class="section-title">Serviços</div>
          <table class="items-table">
            <thead>
              <tr>
                <th>Descrição do Serviço</th>
                <th style="text-align: right;">Valor</th>
              </tr>
            </thead>
            <tbody>
              ${dados.servicos?.map((servico: any) => `
                <tr>
                  <td>${this.texto(servico.descricao)}</td>
                  <td style="text-align: right;">${this.formatarMoeda(servico.valor)}</td>
                </tr>
              `).join('') || '<tr><td colspan="2">Nenhum serviço cadastrado</td></tr>'}
            </tbody>
            <tfoot>
              <tr class="total-row">
                <td style="text-align: right;"><strong>Total Serviços:</strong></td>
                <td style="text-align: right;"><strong>${this.formatarMoeda(dados.totalServicos || 0)}</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div class="section">
          <div class="section-title">Mão de Obra</div>
          <div class="mao-obra-box">
            <span>Valor da Mão de Obra:</span>
            <strong>${this.formatarMoeda(dados.maoDeObra || 0)}</strong>
          </div>
        </div>

        ${dados.observacoes ? `
        <div class="section">
          <div class="section-title">Observações</div>
          <div class="description-box">
            ${this.texto(dados.observacoes)}
          </div>
        </div>
        ` : ''}

        <div class="valor-destaque">
          <label>VALOR TOTAL DO ORÇAMENTO</label>
          <div class="valor">${this.formatarMoeda(dados.valorTotal || 0)}</div>
          <div style="font-size: 14px; margin-top: 10px; opacity: 0.9;">
            Materiais: ${this.formatarMoeda(dados.totalMateriais || 0)} +
            Serviços: ${this.formatarMoeda(dados.totalServicos || 0)} +
            Mão de Obra: ${this.formatarMoeda(dados.maoDeObra || 0)}
          </div>
        </div>

        <div class="footer">
          <p>Este orçamento é válido por 30 dias a partir da data de emissão.</p>
          <p>Os valores podem sofrer alterações mediante avaliação técnica detalhada.</p>
        </div>
      </body>
      </html>
    `;
  }

  private gerarNumeroOrcamento(): string {
    const data = new Date();
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${ano}${mes}${dia}-${random}`;
  }

  private texto(valor: unknown): string {
    if (valor === null || valor === undefined) return '';
    const texto = String(valor).trim();
    return texto === 'null' || texto === 'undefined' ? '' : texto;
  }

  private formatarData(data: string): string {
    if (!data) return 'Não informada';
    const date = new Date(data + 'T00:00:00');
    return date.toLocaleDateString('pt-BR');
  }

  private montarEnderecoCompleto(oficinaInfo: any): string {
    if (!oficinaInfo) return '';
    
    const partes = [];
    if (oficinaInfo.endereco) partes.push(oficinaInfo.endereco);
    if (oficinaInfo.cidade) partes.push(oficinaInfo.cidade);
    if (oficinaInfo.estado) partes.push(oficinaInfo.estado);
    if (oficinaInfo.cep) partes.push(`CEP: ${oficinaInfo.cep}`);
    
    return partes.join(', ');
  }

  private formatarMoeda(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor || 0);
  }
}


