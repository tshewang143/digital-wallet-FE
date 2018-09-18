import { TodoList } from './todo-list';

export interface User {
    id: string;
    secret: string;
    name: string;
    color: string;
    todoLists: User.TodoListDictionary;
}

export namespace User {

    export interface TodoListDictionary {
        [name: string]: TodoList;
    }
}
