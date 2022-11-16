import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { API, APIDefinition, Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { Global } from 'src/app/core/common/constant';
import { DateUtil } from 'src/app/core/utils/date-util';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';
import { CalendarService } from '../../services/calendar.service';

/**
 * 日曆維護 頁面
 * @author David
 */
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  /** ngx-easy-table */
  @ViewChild('table') table: APIDefinition | undefined;
  /** SubSink */
  subs = new SubSink();
  /** 響應式表單 */
  form: FormGroup = this.createForm();
  /** submit狀態 */
  submit = false;
  /** ngx-bootstrap Modal */
  modalRef!: BsModalRef;
  /** 日曆資料 */
  list: any = [];
  /** 條件過濾後日曆資料 */
  data = [];
  /** ngx-easy-table 組態 */
  configuration!: Config;
  /** ngx-easy-table 欄位設定 */
  columns: Columns[] = [];
  /** 查詢條件-年度 */
  year = '';
  /** 查詢修件-月份 */
  month = '';

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private calendarService: CalendarService,
    private dateUtil: DateUtil
  ) {}

  ngOnInit() {
    this.year = (new Date().getFullYear() - 1911).toString();
    this.getList(parseInt(this.year) + 1911);

    this.configuration = { ...DefaultConfig };
    this.columns = [
      { key: 'date', title: '日期', width: '15%' },
      { key: 'name', title: '節日名稱', width: '15%' },
      { key: 'isHoliday', title: '假日', width: '10%' },
      { key: 'description', title: '說明', width: '40%' },
      { key: '', title: '維護', width: '10%' }
    ];
  }

  /**
   * 建立FormGroup
   */
  createForm(): FormGroup {
    return this.fb.group({
      id: null,
      date: ['', Validators.required],
      name: '',
      isHoliday: 'N',
      description: ''
    });
  }

  get f() {
    return this.form.controls;
  }

  /**
   * 取日曆資料
   * @param year 年度
   */
  getList(year: number): void {
    this.subs.sink = this.calendarService.getCalendars(year).subscribe((d) => {
      this.list = d;
      this.data = d;
      if (this.month != '') this.onMonthSearch();
    });
  }

  /**
   * 年度查詢
   */
  onYearSearch(): void {
    this.setPagination(1);
    this.getList(parseInt(this.year) + 1911);
  }

  /**
   * 月份查詢
   */
  onMonthSearch(): void {
    this.setPagination(1);
    if (this.month == '') this.list = this.data;
    else
      this.list = this.data.filter(
        (d: any) => d.date.toString().indexOf('-' + this.month + '-') > -1
      );
  }

  /**
   * 顯示 modal
   * @param template ng-template id
   */
  openModal(template: TemplateRef<any>) {
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
   * 往編輯功能
   */
  toEdit(id: string): void {
    const calendar: any = this.list.find((d: any) => d.id === id);
    this.form.patchValue({
      id: calendar.id,
      date: this.dateUtil.toRocDate(calendar.date),
      name: calendar.name,
      isHoliday: calendar.isHoliday,
      description: calendar.description
    });
  }

  /**
   * 刪除
   * @param id uuid
   */
  del(id: string) {
    this.subs.sink = this.calendarService.deleteById(id).subscribe(
      () => (this.list = this.list.filter((d: any) => d.id !== id)),
      (err) => Swal.fire(err.message)
    );
  }

  /**
   * 儲存
   */
  save() {
    this.submit = true;
    if (this.form.invalid) return;

    const formModel = this.form.value;
    const calendar = {
      id: formModel.id,
      date: this.dateUtil.toDate(formModel.date),
      name: formModel.name,
      isHoliday: formModel.isHoliday,
      category: formModel.category,
      description: formModel.description
    };

    this.subs.sink = this.calendarService.saveCalendar(calendar).subscribe(
      (d) => {
        if (calendar.id === null) {
          this.list = [...this.list, d];
        } else {
          const idx = this.list.findIndex((l: any) => l.id === calendar.id);
          this.list = [
            ...this.list.slice(0, idx),
            calendar,
            ...this.list.slice(idx + 1, this.list.length)
          ];
        }
        Swal.fire(Global.swalSuccess);
        this.modalRef.hide();
        this.submit = false;
      },
      (error) => {
        Swal.fire(error.message);
      }
    );
  }

  /**
   * 設定 ngx-easy-table 頁數
   * @param page 頁數
   */
  setPagination(page: number): void {
    this.table?.apiEvent({
      type: API.setPaginationCurrentPage,
      value: page
    });
  }
}
