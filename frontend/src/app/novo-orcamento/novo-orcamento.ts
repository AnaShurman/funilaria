import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { PdfService } from '../services/pdf.service';
import { PerfilService } from '../dataBase/perfil/perfil-service';
import { OrcamentoService } from '../dataBase/orcamento/orcamento.service';

@Component({
  selector: 'app-novo-orcamento',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PanelModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './novo-orcamento.html',
  styleUrl: './novo-orcamento.scss',
})
export class NovoOrcamento implements OnInit {
  orcamentoForm!: FormGroup;
  logoUrl: string | null = null;
  oficinaInfo: any = null;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private pdfService: PdfService,
    private perfilService: PerfilService,
    private orcamentoService: OrcamentoService
  ) {}

  async ngOnInit(): Promise<void> {
    this.initForm();
    await this.loadOficinaInfo();
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

  initForm(): void {
    this.orcamentoForm = this.fb.group({
      clienteNome: ['', [Validators.required, Validators.minLength(3)]],
      clienteTelefone: ['', Validators.required],
      clienteEmail: ['', [Validators.email]],
      veiculoModelo: ['', Validators.required],
      veiculoPlaca: ['', Validators.required],
      veiculoAno: ['', Validators.required],
      materiais: this.fb.array([]),
      servicos: this.fb.array([]),
      maoDeObra: [null, [Validators.required, Validators.min(0)]],
      observacoes: ['']
    });

    // Adicionar um item inicial em cada array
    this.addMaterial();
    this.addServico();
  }

  // Materiais
  get materiais(): FormArray {
    return this.orcamentoForm.get('materiais') as FormArray;
  }

  createMaterial(): FormGroup {
    return this.fb.group({
      descricao: ['', Validators.required],
      quantidade: [1, [Validators.required, Validators.min(1)]],
      valorUnitario: [0, [Validators.required, Validators.min(0)]]
    });
  }

  addMaterial(): void {
    this.materiais.push(this.createMaterial());
  }

  removeMaterial(index: number): void {
    if (this.materiais.length > 1) {
      this.materiais.removeAt(index);
    }
  }

  // Serviços
  get servicos(): FormArray {
    return this.orcamentoForm.get('servicos') as FormArray;
  }

  createServico(): FormGroup {
    return this.fb.group({
      descricao: ['', Validators.required],
      valor: [0, [Validators.required, Validators.min(0)]]
    });
  }

  addServico(): void {
    this.servicos.push(this.createServico());
  }

  removeServico(index: number): void {
    if (this.servicos.length > 1) {
      this.servicos.removeAt(index);
    }
  }

  // Cálculos
  calcularTotalMateriais(): number {
    return this.materiais.controls.reduce((total, material) => {
      const quantidade = material.get('quantidade')?.value || 0;
      const valorUnitario = material.get('valorUnitario')?.value || 0;
      return total + (quantidade * valorUnitario);
    }, 0);
  }

  calcularTotalServicos(): number {
    return this.servicos.controls.reduce((total, servico) => {
      return total + (servico.get('valor')?.value || 0);
    }, 0);
  }

  calcularTotal(): number {
    const totalMateriais = this.calcularTotalMateriais();
    const totalServicos = this.calcularTotalServicos();
    const maoDeObra = this.orcamentoForm.get('maoDeObra')?.value || 0;
    return totalMateriais + totalServicos + maoDeObra;
  }

  async onSubmit(): Promise<void> {
    if (this.orcamentoForm.valid) {
      try {
        const dadosOrcamento = {
          ...this.orcamentoForm.value,
          totalMateriais: this.calcularTotalMateriais(),
          totalServicos: this.calcularTotalServicos(),
          valorTotal: this.calcularTotal()
        };

        // Save to database first
        const orcamentoSalvo = await this.orcamentoService.salvarOrcamento(dadosOrcamento);
        
        // Add the generated budget number to the data
        dadosOrcamento.numeroOrcamento = orcamentoSalvo.numero_orcamento;

        // Generate PDF with workshop data
        await this.pdfService.gerarOrcamentoPDF(
          dadosOrcamento,
          this.logoUrl || undefined,
          this.oficinaInfo
        );

        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `Orçamento ${orcamentoSalvo.numero_orcamento} salvo e PDF gerado com sucesso!`
        });

        // Clear form after success
        this.orcamentoForm.reset();
        this.materiais.clear();
        this.servicos.clear();
        this.addMaterial();
        this.addServico();
      } catch (error) {
        console.error('Erro ao processar orçamento:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível salvar o orçamento. Verifique sua conexão.'
        });
      }
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Por favor, preencha todos os campos obrigatórios'
      });
      this.markFormGroupTouched(this.orcamentoForm);
    }
  }

  onCancel(): void {
    this.orcamentoForm.reset();
    this.materiais.clear();
    this.servicos.clear();
    this.addMaterial();
    this.addServico();
    this.messageService.add({
      severity: 'info',
      summary: 'Cancelado',
      detail: 'Formulário limpo'
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      
      if (control instanceof FormArray) {
        control.controls.forEach(c => {
          if (c instanceof FormGroup) {
            this.markFormGroupTouched(c);
          }
        });
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.orcamentoForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  preencherDadosTeste(): void {
    // Limpar arrays existentes
    this.materiais.clear();
    this.servicos.clear();

    // Preencher dados do cliente
    this.orcamentoForm.patchValue({
      clienteNome: 'João da Silva',
      clienteTelefone: '(11) 98765-4321',
      clienteEmail: 'joao.silva@email.com',
      veiculoModelo: 'Fiat Uno Vivace',
      veiculoPlaca: 'ABC-1234',
      veiculoAno: '2018',
      maoDeObra: 500,
      observacoes: 'Cliente solicitou reparo urgente. Veículo apresenta amassados na porta dianteira direita e para-choque traseiro.'
    });

    // Adicionar materiais de teste
    this.materiais.push(this.fb.group({
      descricao: ['Tinta automotiva branca', Validators.required],
      quantidade: [2, [Validators.required, Validators.min(1)]],
      valorUnitario: [150, [Validators.required, Validators.min(0)]]
    }));

    this.materiais.push(this.fb.group({
      descricao: ['Massa plástica', Validators.required],
      quantidade: [1, [Validators.required, Validators.min(1)]],
      valorUnitario: [45, [Validators.required, Validators.min(0)]]
    }));

    this.materiais.push(this.fb.group({
      descricao: ['Lixa para funilaria', Validators.required],
      quantidade: [5, [Validators.required, Validators.min(1)]],
      valorUnitario: [8, [Validators.required, Validators.min(0)]]
    }));

    // Adicionar serviços de teste
    this.servicos.push(this.fb.group({
      descricao: ['Funilaria e pintura porta dianteira', Validators.required],
      valor: [350, [Validators.required, Validators.min(0)]]
    }));

    this.servicos.push(this.fb.group({
      descricao: ['Reparo para-choque traseiro', Validators.required],
      valor: [200, [Validators.required, Validators.min(0)]]
    }));

    this.servicos.push(this.fb.group({
      descricao: ['Polimento geral', Validators.required],
      valor: [150, [Validators.required, Validators.min(0)]]
    }));

    this.messageService.add({
      severity: 'info',
      summary: 'Dados de Teste',
      detail: 'Formulário preenchido com dados de exemplo'
    });
  }
}


