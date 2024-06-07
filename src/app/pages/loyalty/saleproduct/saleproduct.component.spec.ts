import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SaleproductComponent } from './saleproduct.component';

describe('SaleproductComponent', () => {
  let component: SaleproductComponent;
  let fixture: ComponentFixture<SaleproductComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleproductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleproductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
