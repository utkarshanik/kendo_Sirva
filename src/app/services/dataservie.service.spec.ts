import { TestBed } from '@angular/core/testing';

import { DataservieService } from './dataservie.service';

describe('DataservieService', () => {
  let service: DataservieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataservieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
