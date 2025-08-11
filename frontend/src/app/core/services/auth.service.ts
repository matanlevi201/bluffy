import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../utils/constants';

export interface JwtPayload {
  id: string;
  name: string;
  email: string;
  exp: number;
  iat: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  signin(email: string, password: string) {
    return this.http.post(
      `${API_BASE_URL}/auth/signin`,
      { email, password },
      { withCredentials: true }
    );
  }

  refreshToken() {
    return this.http.get(`${API_BASE_URL}/auth/refresh`, {
      withCredentials: true,
    });
  }

  signout() {
    return this.http.get(`${API_BASE_URL}/auth/signout`, {
      withCredentials: true,
    });
  }
}
