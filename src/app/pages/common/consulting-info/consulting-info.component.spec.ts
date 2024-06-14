import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultingInfoComponent } from './consulting-info.component';

describe('ConsultingInfoComponent', () => {
  let component: ConsultingInfoComponent;
  let fixture: ComponentFixture<ConsultingInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultingInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultingInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
