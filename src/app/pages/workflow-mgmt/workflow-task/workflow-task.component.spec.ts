import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowTaskComponent } from './workflow-task.component';

describe('WorkflowTaskComponent', () => {
  let component: WorkflowTaskComponent;
  let fixture: ComponentFixture<WorkflowTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkflowTaskComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkflowTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
