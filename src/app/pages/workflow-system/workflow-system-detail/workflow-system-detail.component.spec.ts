import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowSystemDetailComponent } from './workflow-system-detail.component';

describe('WorkflowSystemDetailComponent', () => {
  let component: WorkflowSystemDetailComponent;
  let fixture: ComponentFixture<WorkflowSystemDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkflowSystemDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkflowSystemDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
