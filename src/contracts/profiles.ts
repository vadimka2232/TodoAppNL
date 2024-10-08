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