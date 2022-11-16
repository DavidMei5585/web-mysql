import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Backend } from 'src/app/core/common/constant';
import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(AuthenticationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('login', () => {
    const res = {
      orgCode: 'abc',
      deptCode: 'def',
      userId: 'admin',
      name: 'admin',
      cname: 'admin',
      token: '1234'
    };

    service.login('admin', '1234', '1234', '1234').subscribe((d) => {
      console.log(d);
      expect(d).toEqual(res);
    });

    httpMock
      .expectOne({
        url: `${Backend.Host}/auth/login`,
        method: 'POST'
      })
      .flush(res);
  });

  afterEach(() => {
    httpMock.verify();
  });
});
