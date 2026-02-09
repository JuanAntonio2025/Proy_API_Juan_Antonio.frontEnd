export interface LoginResponse {
  user: User; // Revisar esto
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
}
