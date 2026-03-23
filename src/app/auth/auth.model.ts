export interface LoginResponse {
  user: User;
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: number;
}
