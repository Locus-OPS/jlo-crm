import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SaleproductcategoryComponent } from './saleproductcategory.component';

describe('SaleproductcategoryComponent', () => {
  let component: SaleproductcategoryComponent;
  let fixture: ComponentFixture<SaleproductcategoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleproductcategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleproductcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
