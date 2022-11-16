import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FlowCtrlEditComponent } from './flow-ctrl-edit.component';

describe('FlowCtrlEditComponent', () => {
  let component: FlowCtrlEditComponent;
  let fixture: ComponentFixture<FlowCtrlEditComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [FlowCtrlEditComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowCtrlEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
