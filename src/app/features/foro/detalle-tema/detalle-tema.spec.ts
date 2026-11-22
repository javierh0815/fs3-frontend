import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleTema } from './detalle-tema';

describe('DetalleTema', () => {
  let component: DetalleTema;
  let fixture: ComponentFixture<DetalleTema>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleTema],
    }).compileComponents();

    fixture = TestBed.createComponent(DetalleTema);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
