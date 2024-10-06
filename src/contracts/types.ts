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
  
export interface Profile {
    userId: number;
    name: string;
    email: string;
    age: number;
    location: string;
}
  
export interface ProfileResponse {
    profiles: Profile[];
}

export interface Profile {
    userId: number;
    name: string;
    age: number;
    email: string;
    location: string;
  }
  
export  interface NewProfile {
    name: string;
    age: number;
    email: string;
    location: string;
  }