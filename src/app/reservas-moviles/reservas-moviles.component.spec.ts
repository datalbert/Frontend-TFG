import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservasMovilesComponent } from './reservas-moviles.component';

describe('ReservasMovilesComponent', () => {
  let component: ReservasMovilesComponent;
  let fixture: ComponentFixture<ReservasMovilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservasMovilesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReservasMovilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
