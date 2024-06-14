import { TestBed } from '@angular/core/testing';

import { ConsultingInfoService } from './consulting-info.service';

describe('ConsultingInfoService', () => {
  let service: ConsultingInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsultingInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
