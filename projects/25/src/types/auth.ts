export interface User {
  id: string;
  email: string;
  name: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ProfileUpdate {
  name?: string;
  email?: string;
}
