import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { API_BASE_URL } from '../../utils/constants';

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class CurrentUserService {
  private currentUser$ = new BehaviorSubject<CurrentUser | null>(null);

  constructor(private http: HttpClient) {}

  loadUser(): Observable<CurrentUser | null> {
    return this.http
      .get<CurrentUser>(`${API_BASE_URL}/users/me`, { withCredentials: true })
      .pipe(
        tap((user) => this.currentUser$.next(user)),
        catchError(() => {
          this.currentUser$.next(null);
          return of(null);
        })
      );
  }
  getCurrentUser() {
    return this.currentUser$.asObservable();
  }
}
