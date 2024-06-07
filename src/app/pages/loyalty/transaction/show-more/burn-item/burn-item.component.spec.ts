import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BurnItemComponent } from './burn-item.component';

describe('BurnItemComponent', () => {
  let component: BurnItemComponent;
  let fixture: ComponentFixture<BurnItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BurnItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BurnItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
