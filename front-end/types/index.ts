
export interface User {
    username: string;
    password: string;
    email: string;
  }
  
  
  
  export type StatusMessage = {
    message: string;
    type: 'error' | 'success';
  }
  