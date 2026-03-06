import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NovoOrcamento } from './novo-orcamento';

describe('NovoOrcamento', () => {
  let component: NovoOrcamento;
  let fixture: ComponentFixture<NovoOrcamento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NovoOrcamento]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NovoOrcamento);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
