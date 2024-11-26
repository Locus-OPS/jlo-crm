import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowBusinessRuleComponent } from './workflow-business-rule.component';

describe('WorkflowBusinessRuleComponent', () => {
  let component: WorkflowBusinessRuleComponent;
  let fixture: ComponentFixture<WorkflowBusinessRuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkflowBusinessRuleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkflowBusinessRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
