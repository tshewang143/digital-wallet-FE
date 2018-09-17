import { Component } from '@angular/core';
import { UserUtils } from './utils/user-utils.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(userUtils: UserUtils) {
    userUtils.loginFromStore().subscribe();
  }
}
