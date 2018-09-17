export interface TodoList {
    todo: TodoList.Item[];
    completed: TodoList.Item[];
}

export namespace TodoList {
    export type Item = string;
}
