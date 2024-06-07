import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReIssuesCardComponent } from './re-issues-card.component';

describe('ReIssuesCardComponent', () => {
  let component: ReIssuesCardComponent;
  let fixture: ComponentFixture<ReIssuesCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReIssuesCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReIssuesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
