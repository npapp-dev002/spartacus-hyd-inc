import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpartacusCartUtilsComponent } from './spartacus-cart-utils.component';

describe('SpartacusCartUtilsComponent', () => {
  let component: SpartacusCartUtilsComponent;
  let fixture: ComponentFixture<SpartacusCartUtilsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpartacusCartUtilsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SpartacusCartUtilsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
