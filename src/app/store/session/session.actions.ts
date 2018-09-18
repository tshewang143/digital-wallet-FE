import { Session } from '../../models/session';
import { User } from '../../models/user';

export class SetAction {
    public static readonly type = '[SessionState] Set Session';

    constructor(public session: Session) {}
}

export class InvalidateAction {
    public static readonly type = '[SessionState] Invalidate Session';
}

export class UpdateUserAction {
    public static readonly type = '[SessionState] Update User';

    constructor(public user: User) {}
}
