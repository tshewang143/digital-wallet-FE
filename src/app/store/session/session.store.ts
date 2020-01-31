import { State, Selector, StateContext, Action } from '@ngxs/store';
import { Session } from '../../models/session';
import { SetAction, InvalidateAction, UpdateUserAction, HideBannerAction } from './session.actions';
import { User } from '../../models/user';
import { Injectable } from '@angular/core';

@Injectable()
@State<Session>({
    name: 'session',
    defaults: null
})
export class SessionState {

    @Selector()
    public static getUser(session: Session): User {
        return session ? session.user : undefined;
    }

    @Selector()
    public static getTodoLists(session: Session): User.TodoListDictionary {
        return session ? session.user.todoLists : undefined;
    }

    @Selector()
    public static hideBanner(session: Session): boolean {
        return session ? session.user.hideBanner : false;
    }

    @Action(SetAction)
    public set(context: SessionState.Context, { session }: SetAction) {
        context.setState(session);
    }

    @Action(InvalidateAction)
    public invalidate(context: SessionState.Context, _action: InvalidateAction) {
        context.setState(undefined);
    }

    @Action(UpdateUserAction)
    public updateUser(context: SessionState.Context, action: UpdateUserAction) {
        context.patchState(action);
    }

    @Action(HideBannerAction)
    public hideBanner(context: SessionState.Context, { hideBanner }: HideBannerAction) {
        const session = context.getState();
        session.user.hideBanner = hideBanner;
        context.patchState(session);
    }
}

export namespace SessionState {

    export type Context = StateContext<Session>;
}
