import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RedeemTransactionComponent } from './redeem-transaction.component';

describe('RedeemTransactionComponent', () => {
  let component: RedeemTransactionComponent;
  let fixture: ComponentFixture<RedeemTransactionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RedeemTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedeemTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
