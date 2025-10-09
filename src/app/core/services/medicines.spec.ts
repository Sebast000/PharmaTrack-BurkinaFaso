import { TestBed } from '@angular/core/testing';

import { Medicines } from './medicines';

describe('Medicines', () => {
  let service: Medicines;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Medicines);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
