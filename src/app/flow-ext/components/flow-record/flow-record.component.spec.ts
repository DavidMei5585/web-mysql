import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FlowRecordComponent } from './flow-record.component';

describe('FlowRecordComponent', () => {
  let component: FlowRecordComponent;
  let fixture: ComponentFixture<FlowRecordComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [FlowRecordComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
