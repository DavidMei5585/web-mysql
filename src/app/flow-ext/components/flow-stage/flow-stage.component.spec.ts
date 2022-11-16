import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FlowStageComponent } from './flow-stage.component';

describe('StageComponent', () => {
  let component: FlowStageComponent;
  let fixture: ComponentFixture<FlowStageComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [FlowStageComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
