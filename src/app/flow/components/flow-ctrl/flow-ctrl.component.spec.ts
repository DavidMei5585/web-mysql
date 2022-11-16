import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FlowCtrlComponent } from './flow-ctrl.component';

describe('FlowCtrlComponent', () => {
  let component: FlowCtrlComponent;
  let fixture: ComponentFixture<FlowCtrlComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [FlowCtrlComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowCtrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
