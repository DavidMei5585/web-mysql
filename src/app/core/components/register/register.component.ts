import { Component, Input, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as sha512 from 'js-sha512';
import { BsModalRef } from 'ngx-bootstrap/modal/public_api';
import { Global } from 'src/app/core/common/constant';
import { DataStoreService } from 'src/app/core/services/data-store.service';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../../services/authentication.service';

/**
 * 註冊元件
 * @author David
 */
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnDestroy {
  /** SubSink */
  subs = new SubSink();
  /** 響應式表單  */
  form: FormGroup = this.createForm();
  /** submit狀態 */
  submit = false;
  /** 角色Options */
  roleOpts = [];
  /** 外部傳入的 Bootstrap Modal */
  @Input() modalRef!: BsModalRef;

  constructor(
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private dataStoreService: DataStoreService
  ) {}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  /**
   * 建立FormGroup
   */
  createForm(): FormGroup {
    return this.fb.group({
      id: null,
      userId: ['', Validators.required],
      password: ['', Validators.required],
      cname: ['', Validators.required],
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(
            '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9]{2,63}.[a-zA-Z]{2,63}(.[a-zA-Z]{2,63})?$'
          )
        ])
      ]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  /**
   * 確認
   */
  save(): void {
    this.submit = true;
    if (this.form.invalid) return;

    const formModel = this.form.value;
    const person = {
      userId: formModel.userId,
      email: formModel.email,
      password: sha512.sha512(formModel.password),
      cname: formModel.cname,
      flag: '1'
    };

    this.dataStoreService.loading(true);
    this.subs.sink = this.authenticationService.register(person).subscribe(
      () => {
        Swal.fire(Global.swalSuccessMessage('註冊成功，請稍待審核!'));
        this.modalRef.hide();
        this.dataStoreService.loading(false);
      },
      (error) => {
        Swal.fire(error.message);
        this.dataStoreService.loading(false);
      }
    );
  }
}
