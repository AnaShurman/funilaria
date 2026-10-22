import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PdfService } from '../services/pdf.service';
import { PerfilService } from '../dataBase/perfil/perfil-service';
import { OrcamentoService } from '../dataBase/orcamento/orcamento.service';
import { NovoOrcamento } from './novo-orcamento';

describe('NovoOrcamento', () => {
  let component: NovoOrcamento;
  let fixture: ComponentFixture<NovoOrcamento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NovoOrcamento],
      providers: [
        { provide: PdfService, useValue: { gerarOrcamentoPDF: jasmine.createSpy('gerarOrcamentoPDF') } },
        { provide: PerfilService, useValue: { getOficinaInfo: () => Promise.resolve(null), getImageUrl: () => '' } },
        { provide: OrcamentoService, useValue: { salvarOrcamento: jasmine.createSpy('salvarOrcamento') } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NovoOrcamento);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('does not include a material in the total when its description is blank', () => {
    component.materiais.at(0).patchValue({
      descricao: '   ',
      quantidade: 2,
      valorUnitario: 150
    });

    expect(component.calcularTotalMateriais()).toBe(0);
  });

  it('includes described materials and services in their totals', () => {
    component.materiais.at(0).patchValue({
      descricao: 'Tinta',
      quantidade: 2,
      valorUnitario: 150
    });
    component.servicos.at(0).patchValue({
      descricao: 'Pintura',
      valor: 400
    });

    expect(component.calcularTotalMateriais()).toBe(300);
    expect(component.calcularTotalServicos()).toBe(400);
  });

  it('does not include a service in the total when its description is blank', () => {
    component.servicos.at(0).patchValue({
      descricao: '',
      valor: 400
    });

    expect(component.calcularTotalServicos()).toBe(0);
  });
});
