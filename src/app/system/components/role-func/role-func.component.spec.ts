import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RoleFuncComponent } from './role-func.component';
import { TreeModule } from '@circlon/angular-tree-component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

describe('RoleFuncComponent', () => {
  let component: RoleFuncComponent;
  let fixture: ComponentFixture<RoleFuncComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [RoleFuncComponent],
        imports: [TreeModule, RouterTestingModule, HttpClientModule]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleFuncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
