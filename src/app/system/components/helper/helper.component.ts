import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { saveAs } from 'file-saver';
import { FileUploader } from 'ng2-file-upload';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { Global } from 'src/app/core/common/constant';
import { DataStoreService } from 'src/app/core/services/data-store.service';
import { HelperService } from 'src/app/system/services/helper.service';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-helper',
  templateUrl: './helper.component.html',
  styleUrls: ['./helper.component.scss']
})
export class HelperComponent implements OnInit, OnDestroy {
  /** ng2-file-upload */
  uploader: FileUploader = new FileUploader({ allowedFileType: ['pdf'], disableMultipart: true });
  /** SubSink */
  subs = new SubSink();
  /** 響應式表單 */
  form: FormGroup = this.createForm();
  /** ngx-easy-table 組態 */
  configuration!: Config;
  /** ngx-easy-table 欄位設定 */
  columns: Columns[] = [];
  /** 使用教學資料 */
  list: unknown[] = [];
  /** ngx-bootstrap Modal */
  modalRef!: BsModalRef;
  /** submit狀態 */
  submit = false;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private helperService: HelperService,
    private dataStoreService: DataStoreService
  ) {}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.configuration = { ...DefaultConfig };
    this.columns = [
      { key: 'name', title: '網址', width: '35%' },
      { key: 'filePath', title: '檔案', width: '35%' },
      { key: '', title: '維護', width: '20%' }
    ];

    //this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploader.onWhenAddingFileFailed = (item) => {
      if (item.type.indexOf('pdf') < 0) Swal.fire('僅接受pdf檔案格式');
    };
    this.getList();
  }

  /**
   * 取使用教學
   */
  getList(): void {
    this.subs.sink = this.helperService.getHelpers().subscribe((d) => (this.list = d));
  }

  /**
   * 建立FormGroup
   */
  createForm(): FormGroup {
    return this.fb.group({
      id: null,
      name: ['', Validators.required]
    });
  }

  /**
   * 顯示 modal
   * @param template ng-template id
   */
  openModal(template: TemplateRef<unknown>): void {
    this.modalRef = this.modalService.show(template, Global.modalConfig);
  }

  /**
   * 往新增功能
   */
  toAdd(): void {
    this.submit = false;
    this.form.reset();
  }

  /**
   * 儲存
   */
  save(): void {
    this.submit = true;
    if (this.form.invalid) {
      return;
    }

    const formData = new FormData();
    this.uploader.queue.forEach((fileItem) => {
      formData.append('file', fileItem.file.rawFile);
    });
    const formModel = this.form.value;
    formData.append('id', formModel.id);
    formData.append('name', formModel.name);

    this.dataStoreService.loading(true);
    this.helperService.uploadFile(formData).subscribe(
      () => {
        Swal.fire(Global.swalUploadSuccess);
        this.getList();
        this.modalRef.hide();
        this.dataStoreService.loading(false);
        this.uploader.queue = [];
      },
      () => {
        this.uploader.queue = [];
        this.dataStoreService.loading(false);
        Swal.fire(Global.swalError);
      }
    );
  }

  /**
   * 刪除
   * @param id uuid
   */
  del(id: string): void {
    this.subs.sink = this.helperService.delHelper(id).subscribe(
      () => {
        this.getList();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  /**
   * 下載使用教學pdf
   * @param id uuid
   * @param name
   */
  getPdf(id: string, name: string): void {
    this.subs.sink = this.helperService.getPdfById(id).subscribe((d) => {
      const blob = new Blob([d], { type: 'application/pdf' });
      saveAs(blob, name);
    });
  }
}
