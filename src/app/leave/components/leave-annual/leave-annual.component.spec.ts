import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LeaveAnnualComponent } from './leave-annual.component';

describe('AnnualComponent', () => {
  let component: LeaveAnnualComponent;
  let fixture: ComponentFixture<LeaveAnnualComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [LeaveAnnualComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveAnnualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
