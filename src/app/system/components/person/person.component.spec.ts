import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TableModule } from 'ngx-easy-table';
import { HttpUtil } from 'src/app/core/utils/http-util';
import { TaiwanDatePipe } from 'src/app/shared/pipes/taiwan-date.pipe';
import { PersonComponent } from './person.component';

describe('PersonComponent', () => {
  let component: PersonComponent;
  let fixture: ComponentFixture<PersonComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [PersonComponent, TaiwanDatePipe],
        imports: [
          ReactiveFormsModule,
          TableModule,
          SweetAlert2Module,
          ModalModule.forRoot(),
          HttpClientModule
        ],
        providers: [HttpUtil]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
