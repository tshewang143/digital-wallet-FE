import { Component } from '@angular/core';
import { UserUtils } from './utils/user-utils.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(userUtils: UserUtils, router: Router) {
    // Navigate the user to the home page if already logged in
    userUtils.loginFromStore().subscribe(() => router.navigate(['/home']));
  }
}
