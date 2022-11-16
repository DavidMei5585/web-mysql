import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LeaveMainComponent } from './leave-main.component';

describe('LeaveMainComponent', () => {
  let component: LeaveMainComponent;
  let fixture: ComponentFixture<LeaveMainComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [LeaveMainComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
