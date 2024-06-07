import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LocationBasePointComponent } from './location-base-point.component';

describe('LocationBasePointComponent', () => {
  let component: LocationBasePointComponent;
  let fixture: ComponentFixture<LocationBasePointComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationBasePointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationBasePointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
