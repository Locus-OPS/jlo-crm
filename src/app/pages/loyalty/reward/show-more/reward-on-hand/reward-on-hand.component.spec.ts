import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RewardOnHandComponent } from './reward-on-hand.component';

describe('RewardOnHandComponent', () => {
  let component: RewardOnHandComponent;
  let fixture: ComponentFixture<RewardOnHandComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RewardOnHandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RewardOnHandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
