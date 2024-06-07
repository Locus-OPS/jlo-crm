import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TierDetailComponent } from './tier-detail.component';

describe('TierDetailComponent', () => {
  let component: TierDetailComponent;
  let fixture: ComponentFixture<TierDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TierDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TierDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
