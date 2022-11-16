import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PersonStageComponent } from './person-stage.component';

describe('PersonStageComponent', () => {
  let component: PersonStageComponent;
  let fixture: ComponentFixture<PersonStageComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [PersonStageComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
