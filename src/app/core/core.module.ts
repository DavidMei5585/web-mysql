import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { LoginComponent } from './components/login/login.component';
import { NoAuthorityComponent } from './components/no-authority/no-authority.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { RegisterComponent } from './components/register/register.component';
import { ResetPwdComponent } from './components/reset-pwd/reset-pwd.component';

@NgModule({
  declarations: [
    LoginComponent,
    NotFoundComponent,
    NoAuthorityComponent,
    ErrorPageComponent,
    ResetPwdComponent,
    RegisterComponent
  ],
  imports: [CommonModule, FormsModule, RouterModule, SharedModule]
})
export class CoreModule {}
