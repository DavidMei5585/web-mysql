import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { of } from 'rxjs';
import { InputInvalidPipe } from '../../../shared/pipes/input-invalid.pipe';
import { AuthenticationService } from '../../services/authentication.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockService: jasmine.SpyObj<AuthenticationService>;
  const mockImage = {
    code: 'v6S0WQa8oc7E5gNcDHN0W+rwiMvBnhpXrYfdd20+U1M=',
    expireTime: '2021-07-12T15:25:52.7903426',
    image:
      'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAEEAAAAcCAIAAACxhUU7AAACt0lEQVR4Xr2WwY0VMRBENxguHDYLJBJAnEgAEQBhEYHPSEwyhMDs7/2PN9W2/4oDUmnUrq4ud6898/fp+P3rHzB+/ujk/0Q1UM+nfTer7MkXNszKIaoi28UrDWPsZkC0SlUQ8Qpd/9DcTCdR7mYo0ftP34H5aIXlu8/P7pgs+PrxwwkLOr49fwE9a4zVObDf2XePEVTgqnOAExtB4Zxhmq2g+sbh4RiXGSgr8Idn72JYuo9xH8AmYQhT5zDNuuMS7GcYcQ50M+7t2guSpVHdxwwuZ8lFYkcvo+NiuqeRd4mlb07x436dLAb7GRAftxmIp+JqupaOrXThywyRq6BfpHF9JWxE6wQr20PnYGUJeL7lhaYqZ8Ao3mCYqB+3vmGIu6yYeJtLEAwDUDUF+tcZ+q6HjqJ4L7HwH94XqRvWs3+RKD/un1SY/Tlg8vo+2NHL+lkosBPgp6CecZHsyZKXgULg7k16R0qID+4SIBG6+CJVqj6mHWFFYbwJFbOsdtnCZIc1T53CnSAulfXmfSzdZNx/2nptwd9QND6c0IPLDC4unltEAYJAv0iB43qRInW0l2HoZNxxYKzOgXfAqaiMIGZw6rh1D2Kv8Oej9JYTKFzeaavDvdutSnqt4VTIEE+rpssK/v5OT7eEj/0iFbE3iMKwWqH30G1xu8wQ6uBxd+BllJs3E4ZThFWYRJAz9OKVNcspv/F0SThHTInR/fP/ViyiLPaLrJ99j2kcerLeJVIrq5fvkutxCX6F0O8RGpvTU3TiNiILljN4p4jD0bXTONw62c29tFv3P2KGiqkM99hgA4utt1vwK9IBCP8HM5h0Kkw7orbzXRZib7eqqnhyl8LxIexua7s5NunyiiGnyxBXMJnB1g4CduwIjat6qsu63jJXDf5f2rs4NZXZ1PqVs7MrmZdTnpI/s5pJTWV8gT0AAAAASUVORK5CYII='
  };

  beforeEach(
    waitForAsync(() => {
      mockService = jasmine.createSpyObj(['imageCode', 'login']);
      mockService.imageCode.and.returnValue(of(mockImage));
      mockService.login.and.returnValue(of({}));

      TestBed.configureTestingModule({
        declarations: [InputInvalidPipe, LoginComponent],
        imports: [
          ReactiveFormsModule,
          RouterTestingModule,
          HttpClientTestingModule,
          ModalModule.forRoot()
        ],
        providers: [BsModalService, { provide: AuthenticationService, useValue: mockService }]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('取得驗證碼', () => {
    //spyOn(mockService, 'imageCode').and.returnValue(of(mockImage));
    component.ngOnInit();
    expect(component.imageCode).toEqual(mockImage);
  });

  it('登入', () => {
    component.form.patchValue({
      userId: 'admin',
      password: '1234',
      code: '1234'
    });
    component.login();
    fixture.detectChanges();
  });
});
