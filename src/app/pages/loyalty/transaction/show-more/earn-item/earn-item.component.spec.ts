import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EarnItemComponent } from './earn-item.component';

describe('EarnItemComponent', () => {
  let component: EarnItemComponent;
  let fixture: ComponentFixture<EarnItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EarnItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EarnItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
