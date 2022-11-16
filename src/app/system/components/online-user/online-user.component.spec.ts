import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OnlineUserComponent } from './online-user.component';

describe('OnlineUserComponent', () => {
  let component: OnlineUserComponent;
  let fixture: ComponentFixture<OnlineUserComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [OnlineUserComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
