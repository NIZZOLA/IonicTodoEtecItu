import { TestBed } from '@angular/core/testing';

import { TaskToDoService } from './task-to-do.service';

describe('TaskToDoService', () => {
  let service: TaskToDoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskToDoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
