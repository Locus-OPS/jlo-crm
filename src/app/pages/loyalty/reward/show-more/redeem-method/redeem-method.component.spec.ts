import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RedeemMethodComponent } from './redeem-method.component';

describe('RedeemMethodComponent', () => {
  let component: RedeemMethodComponent;
  let fixture: ComponentFixture<RedeemMethodComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RedeemMethodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedeemMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
