import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FlowDetailComponent } from './flow-detail.component';

describe('TodoDetailComponent', () => {
  let component: FlowDetailComponent;
  let fixture: ComponentFixture<FlowDetailComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [FlowDetailComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
