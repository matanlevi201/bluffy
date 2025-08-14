import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, of, tap } from 'rxjs';
import { API_BASE_URL } from '../../utils/constants';

export interface Player {
  id: string;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class PlayersService {
  private players$ = new BehaviorSubject<Player[]>([]);

  constructor(private http: HttpClient) {}

  loadPlayers() {
    return this.http
      .get<Player[]>(`${API_BASE_URL}/users`, { withCredentials: true })
      .pipe(
        tap((players) => this.players$.next(players)),
        catchError((e) => {
          this.players$.next([]);
          return of(null);
        })
      );
  }

  getPlayers() {
    return this.players$.asObservable();
  }
}
