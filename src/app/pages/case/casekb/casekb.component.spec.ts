import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasekbComponent } from './casekb.component';

describe('CasekbComponent', () => {
  let component: CasekbComponent;
  let fixture: ComponentFixture<CasekbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CasekbComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CasekbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
