import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AttributeTabComponent } from './attribute-tab.component';

describe('AttributeTabComponent', () => {
  let component: AttributeTabComponent;
  let fixture: ComponentFixture<AttributeTabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AttributeTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributeTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
