import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaReservasMovComponent } from './lista-reservas-mov.component';

describe('ListaReservasMovComponent', () => {
  let component: ListaReservasMovComponent;
  let fixture: ComponentFixture<ListaReservasMovComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaReservasMovComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListaReservasMovComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
