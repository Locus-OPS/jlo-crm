import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PromotionAttrComponent } from './promotion-attr.component';

describe('PromotionAttrComponent', () => {
  let component: PromotionAttrComponent;
  let fixture: ComponentFixture<PromotionAttrComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PromotionAttrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotionAttrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
