import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TierTabComponent } from './tier-tab.component';

describe('TierTabComponent', () => {
  let component: TierTabComponent;
  let fixture: ComponentFixture<TierTabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TierTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TierTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
