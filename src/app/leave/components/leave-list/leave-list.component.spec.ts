import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LeaveListComponent } from './leave-list.component';

describe('LeaveListComponent', () => {
  let component: LeaveListComponent;
  let fixture: ComponentFixture<LeaveListComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [LeaveListComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
