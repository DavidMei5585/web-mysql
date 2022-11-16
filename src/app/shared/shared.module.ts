import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { FileUploadModule } from 'ng2-file-upload';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TableModule } from 'ngx-easy-table';
import { LightboxModule } from 'ngx-lightbox';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DatepickerDirective } from './directives/date-picker.directive';
import { NumberDirective } from './directives/number.directive';
import { YearMonthPickerDirective } from './directives/year-month-picker.directive';
import { YearPickerDirective } from './directives/year-picker.directive';
import { CodePipe } from './pipes/code.pipe';
import { InputInvalidPipe } from './pipes/input-invalid.pipe';
import { TaiwanDatePipe } from './pipes/taiwan-date.pipe';

@NgModule({
  declarations: [
    InputInvalidPipe,
    CodePipe,
    TaiwanDatePipe,
    DatepickerDirective,
    YearPickerDirective,
    YearMonthPickerDirective,
    NumberDirective
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    SweetAlert2Module.forRoot(),
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    NgSelectModule,
    TableModule,
    FileUploadModule,
    DragDropModule,
    NgxSpinnerModule,
    LightboxModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    SweetAlert2Module,
    ModalModule,
    NgSelectModule,
    TableModule,
    TooltipModule,
    FileUploadModule,
    DragDropModule,
    NgxSpinnerModule,
    InputInvalidPipe,
    CodePipe,
    TaiwanDatePipe,
    DatepickerDirective,
    YearPickerDirective,
    YearMonthPickerDirective,
    NumberDirective
  ]
})
export class SharedModule {}
