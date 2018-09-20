import { RegisterComponent } from './pages/register/register.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { WebStorageModule } from 'ngx-store';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatCardModule,
  MatInputModule,
  MatToolbarModule,
  MatSidenavModule,
  MatListModule,
  MatRadioModule,
  MatIconModule,
  MatExpansionModule,
  MatSnackBarModule
} from '@angular/material';

import { AppComponent } from './app.component';
import { RoutesModule } from './routes.module';
import { NgxsModule } from '@ngxs/store';
import { SessionState } from './store/session/session.store';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { UserUtils } from './utils/user-utils.service';
import { SessionUtils } from './utils/session-utils.service';
import { AuthGuard } from './guards/auth-guard.service';
import { TodoListViewComponent } from './shared/todo-list-view/todo-list-view.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    TodoListViewComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    MatInputModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatRadioModule,
    MatIconModule,
    MatExpansionModule,
    MatSnackBarModule,

    NgxsModule.forRoot([
      SessionState
    ]),
    WebStorageModule,

    RoutesModule
  ],
  providers: [
    UserUtils,
    SessionUtils,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
