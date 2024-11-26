import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowTaskAssignComponent } from './workflow-task-assign.component';

describe('WorkflowTaskAssignComponent', () => {
  let component: WorkflowTaskAssignComponent;
  let fixture: ComponentFixture<WorkflowTaskAssignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkflowTaskAssignComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkflowTaskAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
