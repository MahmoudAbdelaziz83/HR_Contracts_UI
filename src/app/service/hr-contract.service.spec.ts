import { TestBed } from '@angular/core/testing';

import { HRContractService } from './hr-contract.service';

describe('HRContractService', () => {
  let service: HRContractService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HRContractService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
