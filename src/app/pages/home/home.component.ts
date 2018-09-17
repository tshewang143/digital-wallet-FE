import { Component } from '@angular/core';
import { StateEmitter } from '@lithiumjs/angular';
import { Select } from '@ngxs/store';
import { SessionState } from '../../store/session/session.store';
import { Observable } from 'rxjs';
import { User } from '../../models/user';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  @StateEmitter({ readOnly: true })
  @Select(SessionState.getUser)
  private user$: Observable<User>;

  constructor(store: Store) {}
}
