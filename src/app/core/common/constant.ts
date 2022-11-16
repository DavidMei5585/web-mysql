import { environment } from '../../../environments/environment';

/**
 * 共用 Global
 * @author David
 */
export class Global {
  static RetryCount = 1;
  static StorageToken = 'wytn';

  static AllowedFileExts: string[] = [
    //images
    'jpg',
    'jpeg',
    'png',
    'bmp',
    'gif',
    //compressed files
    'zip',
    'rar',
    //ms office ducuments
    'doc',
    'docx',
    'ppt',
    'pptx',
    'xls',
    'xlsx',
    //other documents
    'pdf',
    'txt',
    'csv'
  ];

  static swalSuccess: any = {
    icon: 'success',
    title: '確認成功',
    timer: 1500,
    timerProgressBar: true,
    showConfirmButton: true
  };

  static swalDeleteSuccess: any = {
    icon: 'success',
    title: '刪除成功',
    timer: 1500,
    timerProgressBar: true,
    showConfirmButton: true
  };

  static swalError: any = {
    icon: 'error',
    title: '作業失敗',
    showConfirmButton: true
  };

  static swalUploadSuccess: any = {
    icon: 'success',
    title: '上傳成功',
    timer: 1500,
    timerProgressBar: true,
    showConfirmButton: true
  };

  static swalSuccessMessage(message: string): any {
    return {
      icon: 'success',
      title: message,
      timer: 1500,
      timerProgressBar: true,
      showConfirmButton: true
    };
  }

  static swalWarnMessage(message: string): any {
    return {
      icon: 'warning',
      title: message,
      showConfirmButton: true
    };
  }

  static modalConfig = {
    animated: true,
    keyboard: false,
    backdrop: true,
    ignoreBackdropClick: true
  };
}

export class Backend {
  static Host = environment.host;
}
