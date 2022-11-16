import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import html2canvas from 'html2canvas';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Lightbox } from 'ngx-lightbox';
import { Global } from 'src/app/core/common/constant';
import { DataStoreService } from 'src/app/core/services/data-store.service';
import { SubSink } from 'subsink';

declare let MediaRecorder: any;

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {
  /** SubSink */
  subs = new SubSink();
  /** 響應式表單 */
  form: FormGroup = this.createForm();
  /** ngx-bootstrap Modal */
  modalRef!: BsModalRef;
  /** Bootstrap Modal template */
  @ViewChild('template') template: any;

  albums: any = [];

  videos: any = [];
  recorder: any;
  stream: any;

  constructor(
    private fb: FormBuilder,
    private dataStoreService: DataStoreService,
    private lightbox: Lightbox,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {}

  createForm(): FormGroup {
    return this.fb.group({
      files: this.fb.array([]),
      desc: ''
    });
  }

  /**
   * 顯示 modal
   * @param template ng-template #id
   */
  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, { ...Global.modalConfig, class: 'modal-lg' });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  get files(): FormArray {
    return this.form.get('files') as FormArray;
  }

  setFormArray(): void {
    const formArray = this.f.files as FormArray;
    formArray.controls = [];
    this.albums
      .filter((d: any) => d.blob)
      .forEach((d: any) => {
        formArray.push(this.fb.group(d));
      });
    this.videos
      .filter((d: any) => d.blob)
      .forEach((d: any) => {
        formArray.push(this.fb.group(d));
      });
    this.dataStoreService.loading(false);
  }

  onCapture(): void {
    this.modalRef.hide();
  }

  save(): void {
    const formData = new FormData();

    const formArray = this.f.files as FormArray;
    formArray.getRawValue().forEach((d) => {
      formData.append('files', d.blob);
    });

    console.log(formData);
  }

  clear(): void {
    const formArray = this.f.files as FormArray;
    formArray.controls = [];
    this.albums = [];
    this.videos = [];
    this.modalRef.hide();
  }

  open(index: number): void {
    // open lightbox
    this.lightbox.open(this.albums, index);
  }

  del(index: number): void {
    this.albums = [
      ...this.albums.slice(0, index),
      ...this.albums.slice(index + 1, this.albums.length)
    ];
    this.setFormArray();
  }

  toClear(): void {
    this.albums = [];
    this.videos = [];
  }

  startCapture(): void {
    const self = this;
    html2canvas(document.body).then(function (canvas) {
      //var imgData = canvas.toDataURL("image/png");

      self.albums = [
        ...self.albums,
        {
          fileType: 'png',
          blob: canvas,
          src: canvas.toDataURL('image/png')
        }
      ];

      self.setFormArray();
      self.openModal(self.template);
    });
  }

  stopRecord() {
    this.recorder.stop();
    this.stream.getVideoTracks()[0].stop();
    this.openModal(this.template);
  }

  async startRecording() {
    this.stream = await navigator.mediaDevices
      .getDisplayMedia({
        video: true
      })
      .catch((err: any) => {
        console.log(err);
      });

    if (this.stream == null) return;

    this.recorder = new MediaRecorder(this.stream);

    const chunks: any[] = [];
    this.recorder.ondataavailable = (e: any) => chunks.push(e.data);
    this.recorder.onstop = () => {
      const completeBlob = new Blob(chunks, { type: chunks[0].type });

      this.videos.push({
        fileType: 'webm',
        blob: completeBlob,
        src: this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(completeBlob))
      });

      this.setFormArray();
    };

    this.stream.getVideoTracks()[0].onended = () => {
      this.openModal(this.template);
    };

    this.recorder.start();
  }
}
