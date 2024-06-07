import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VerifyCustomerDialogComponent } from './verify-customer-dialog.component';

describe('VerifyCustomerDialogComponent', () => {
  let component: VerifyCustomerDialogComponent;
  let fixture: ComponentFixture<VerifyCustomerDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyCustomerDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyCustomerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
