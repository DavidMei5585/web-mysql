import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Global } from 'src/app/core/common/constant';
import { DataStoreService } from 'src/app/core/services/data-store.service';
import { ProfileService } from 'src/app/home/services/profile.service';
import { SubSink } from 'subsink';
import swal from 'sweetalert2';

/**
 * 個人資訊 頁面
 * @author David
 */
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  /** SubSink */
  subs = new SubSink();
  /** 響應式表單 */
  form: FormGroup = this.createForm();
  /** submit狀態 */
  submit = false;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private dataStoreService: DataStoreService
  ) {}

  ngOnInit() {
    this.subs.sink = this.profileService.getProfile().subscribe((d) => {
      this.f.id.patchValue(d.id);
      this.f.userId.patchValue(d.userId);
      this.f.name.patchValue(d.name);
      this.f.cname.patchValue(d.cname);
      this.f.email.patchValue(d.email);
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  /**
   * 建立FormGroup
   */
  createForm(): FormGroup {
    return this.fb.group({
      id: '',
      userId: '',
      name: ['', Validators.required],
      cname: ['', Validators.required],
      email: ['', Validators.required]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  /**
   * 確認
   */
  confirm(): void {
    this.submit = true;
    if (this.form.invalid) {
      return;
    }

    const formModel = this.form.value;
    const profile = {
      id: formModel.id,
      userId: formModel.userId,
      name: formModel.name,
      cname: formModel.cname,
      email: formModel.email
    };

    this.dataStoreService.loading(true);

    this.subs.sink = this.profileService.updProfile(profile).subscribe(
      () => {
        this.dataStoreService.loading(false);
        swal.fire(Global.swalSuccess);
      },
      () => {
        this.dataStoreService.loading(false);
      }
    );
  }
}
