import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FuncComponent } from './func.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { TreeModule } from '@circlon/angular-tree-component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap/modal';

describe('FuncComponent', () => {
  let component: FuncComponent;
  let fixture: ComponentFixture<FuncComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [FuncComponent],
        imports: [
          ReactiveFormsModule,
          SweetAlert2Module.forRoot(),
          TreeModule,
          ModalModule.forRoot(),
          HttpClientModule
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FuncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
