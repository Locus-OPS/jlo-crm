import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowMgmtComponent } from './workflow-mgmt.component';

describe('WorkflowMgmtComponent', () => {
  let component: WorkflowMgmtComponent;
  let fixture: ComponentFixture<WorkflowMgmtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkflowMgmtComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkflowMgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
