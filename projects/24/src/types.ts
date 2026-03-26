export interface User {
  id: string;
  email: string;
  name: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
}
