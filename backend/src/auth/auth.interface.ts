export interface JwtPayload {
  id: string;
  email: string;
}

export interface AuthUserResponse {
  id: string;
  email: string;
  token: string;
  role: string;
}
