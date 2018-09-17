import { Session } from '../../models/session';

export class SetAction {
    public static readonly type = '[SessionState] Set Session';

    constructor(public session: Session) {}
}

export class InvalidateAction {
    public static readonly type = '[SessionState] Invalidate Session';
}
