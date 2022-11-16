import { TestBed } from '@angular/core/testing';

import { FlowCtrlService } from './flow-ctrl.service';

describe('FlowCtrlService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FlowCtrlService = TestBed.get(FlowCtrlService);
    expect(service).toBeTruthy();
  });
});
