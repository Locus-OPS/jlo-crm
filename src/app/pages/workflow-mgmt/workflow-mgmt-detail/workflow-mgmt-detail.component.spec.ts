import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowMgmtDetailComponent } from './workflow-mgmt-detail.component';

describe('WorkflowMgmtDetailComponent', () => {
  let component: WorkflowMgmtDetailComponent;
  let fixture: ComponentFixture<WorkflowMgmtDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkflowMgmtDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkflowMgmtDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
