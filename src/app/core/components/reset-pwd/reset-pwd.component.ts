import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as sha512 from 'js-sha512';
import { switchMap, tap } from 'rxjs/operators';
import { Global } from 'src/app/core/common/constant';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../../services/authentication.service';

/**
 * 忘記密碼元件
 * @author David
 */
@Component({
  selector: 'app-reset-pwd',
  templateUrl: './reset-pwd.component.html',
  styleUrls: ['./reset-pwd.component.scss']
})
export class ResetPwdComponent implements OnInit {
  /** SubSink */
  subs = new SubSink();
  /** 響應式表單 */
  form: FormGroup = this.createForm();
  /** submit狀態 */
  submit = false;
  /** 驗證是否相符狀態 */
  notSame = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.subs.sink = this.route.params
      .pipe(
        tap((v) => this.f.token.patchValue(v['tk'])),
        switchMap(() => this.authenticationService.linkPwd(this.f.token.value))
      )
      .subscribe(
        (d) => {
          this.f.userId.patchValue(d.userId);
        },
        () => {
          Swal.fire(Global.swalWarnMessage('無效的重設密碼，請重新作業'));
          this.router.navigate(['/login']);
        }
      );
  }

  createForm(): FormGroup {
    return this.fb.group({
      userId: ['', Validators.required],
      pwd: ['', Validators.required],
      confirmPwd: ['', Validators.required],
      token: ['', Validators.required]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  /**
   * 確認
   * @returns
   */
  confirm(): void {
    this.submit = true;
    if (this.form.invalid) return;

    const formModel = this.form.value;
    const rest = {
      userId: formModel.userId,
      password: sha512.sha512(formModel.pwd),
      token: formModel.token
    };

    this.authenticationService.restPwd(rest).subscribe(
      () => {
        Swal.fire(Global.swalSuccessMessage('重設成功, 請重新登入'));
        this.router.navigate(['/login']);
      },
      (error) => {
        Swal.fire(error.message);
      }
    );
  }

  comparePwd(): void {
    this.notSame = this.f.pwd.value != this.f.confirmPwd.value ? true : false;
    if (this.notSame) {
      this.f.confirmPwd.setErrors({ notSame: true });
    } else {
      this.f.confirmPwd.setErrors(null);
    }
  }
}
