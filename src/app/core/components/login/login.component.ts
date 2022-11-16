import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Global } from 'src/app/core/common/constant';
import { DataStoreService } from 'src/app/core/services/data-store.service';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../../services/authentication.service';
import { TokenStoreService } from '../../services/token-store.service';

/**
 * 登入頁
 * @author David
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {
  /** 帳號Element */
  @ViewChild('useridInput') useridInput!: ElementRef;
  /** SubSink */
  subs = new SubSink();
  /** 響應式表單 */
  form: FormGroup = this.createForm();
  /** submit狀態 */
  submit = false;
  /** ngx-bootstrap Modal */
  modalRef!: BsModalRef;
  /** 帳號，帶入忘記密碼modal */
  userId = '';
  /** 驗證碼物件 */
  imageCode: any = {};

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private tokenStoreService: TokenStoreService,
    private dataStoreService: DataStoreService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    // token 登入
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token !== '' && token !== null) {
      this.authenticationService.link(token).subscribe(
        (d) => {
          if (d !== null) {
            this.tokenStoreService.setToken(d.token);
            this.router.navigate(['/home']);
          }
        },
        (error) => {
          Swal.fire(error.message);
        }
      );
    }

    this.subs.sink = this.authenticationService.imageCode().subscribe((d) => {
      this.imageCode = d;
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.useridInput?.nativeElement.focus();
    }, 200);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  /**
   * 建立FormGroup
   */
  createForm(): FormGroup {
    return this.fb.group({
      userId: ['', Validators.required],
      password: ['', Validators.required],
      code: ['', Validators.required]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  /**
   * 登入
   */
  login(): void {
    this.submit = true;
    if (this.form.invalid) {
      return;
    }

    this.dataStoreService.loading(true);
    this.subs.sink = this.authenticationService
      .login(this.f.userId.value, this.f.password.value, this.f.code.value, this.imageCode.code)
      .subscribe(
        (d) => {
          this.tokenStoreService.setToken(d.token);
          this.router.navigate(['/home']);
          this.dataStoreService.loading(false);
        },
        (error) => {
          Swal.fire(error.message);
          this.dataStoreService.loading(false);
        }
      );
  }

  /**
   * 顯示 modal
   * @param template ng-template #id
   */
  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, Global.modalConfig);
    this.userId = this.f.userId.value;
  }

  /**
   * 送出忘記密碼
   */
  send(): void {
    this.dataStoreService.loading(true);
    this.subs.sink = this.authenticationService.sendRestPwd(this.userId).subscribe(
      () => {
        Swal.fire(Global.swalSuccessMessage('送出成功'));
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
