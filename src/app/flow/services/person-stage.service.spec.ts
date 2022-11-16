import { TestBed } from '@angular/core/testing';

import { PersonStageService } from './person-stage.service';

describe('PersonStageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PersonStageService = TestBed.get(PersonStageService);
    expect(service).toBeTruthy();
  });
});
