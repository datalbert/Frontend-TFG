import { TestBed } from '@angular/core/testing';

import { PermissionErrorService } from './permission-error.service';

describe('PermissionErrorService', () => {
  let service: PermissionErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PermissionErrorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
