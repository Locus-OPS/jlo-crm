import { TestBed } from '@angular/core/testing';

import { SaleproductService } from './saleproduct.service';

describe('SaleproductService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SaleproductService = TestBed.get(SaleproductService);
    expect(service).toBeTruthy();
  });
});
