export interface Todo {
    id: number;
    todo: string;
    completed: boolean;
    userId:number;
}
export interface NewTodo {
    todo: string;
    completed: boolean;
    userId:number;
}
export interface TodoResponse {
    todos: Todo[];
}