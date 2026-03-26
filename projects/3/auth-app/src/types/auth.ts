export interface User {
  id: string;
  email: string;
  name: string;
}

export interface UserUpdate {
  name?: string;
  email?: string;
}
