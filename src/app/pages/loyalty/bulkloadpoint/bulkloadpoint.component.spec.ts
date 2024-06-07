import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BulkloadpointComponent } from './bulkloadpoint.component';

describe('BulkloadpointComponent', () => {
  let component: BulkloadpointComponent;
  let fixture: ComponentFixture<BulkloadpointComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkloadpointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkloadpointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
