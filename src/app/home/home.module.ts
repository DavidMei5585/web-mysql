import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { ContentComponent } from './components/content/content.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { HelperComponent } from './components/helper/helper.component';
import { IframeComponent } from './components/iframe/iframe.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TimerComponent } from './components/timer/timer.component';
import { NavItemDirective } from './directives/nav-item.directive';
import { NavbarCollapseDirective } from './directives/navbar-collapse.directive';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';

@NgModule({
  declarations: [
    HomeComponent,
    FooterComponent,
    IframeComponent,
    ProfileComponent,
    NavbarComponent,
    ContentComponent,
    HeaderComponent,
    TimerComponent,
    HelperComponent,
    SidebarComponent,
    ContentComponent,
    FeedbackComponent,
    NavItemDirective,
    NavbarCollapseDirective
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    CoreModule,
    HomeRoutingModule,
    PdfViewerModule
  ]
})
export class HomeModule {}
