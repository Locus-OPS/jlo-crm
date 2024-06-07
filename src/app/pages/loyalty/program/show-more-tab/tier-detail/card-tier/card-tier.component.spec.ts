import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CardTierComponent } from './card-tier.component';

describe('CardTierComponent', () => {
  let component: CardTierComponent;
  let fixture: ComponentFixture<CardTierComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CardTierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardTierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
