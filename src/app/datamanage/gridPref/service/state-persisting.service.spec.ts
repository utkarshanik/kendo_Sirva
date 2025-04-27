import { TestBed } from '@angular/core/testing';

import { StatePersistingService } from './state-persisting.service';

describe('StatePersistingService', () => {
  let service: StatePersistingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatePersistingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
