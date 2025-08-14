import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_BASE_URL } from '../../utils/constants';
import { BehaviorSubject, catchError, of, tap } from 'rxjs';

export interface Room {
  id: string;
  hostId: string;
  roomCode: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({ providedIn: 'root' })
export class RoomsService {
  private activeRoom$ = new BehaviorSubject<Room | null>(null);

  constructor(private http: HttpClient) {}

  loadActiveRoom() {
    const activeRoomCode = localStorage.getItem('activeRoomCode');
    return this.http
      .get<Room>(`${API_BASE_URL}/rooms/${activeRoomCode}`, {
        withCredentials: true,
      })
      .pipe(
        tap((room) => this.activeRoom$.next(room)),
        catchError((e) => {
          console.log({ e });
          return of(null);
        })
      );
  }

  createRoom() {
    return this.http
      .post<Room>(`${API_BASE_URL}/rooms`, { withCredentials: true })
      .pipe(
        tap((room) => localStorage.setItem('activeRoomCode', room.roomCode)),
        catchError((e) => {
          console.log({ e });
          return of(null);
        })
      );
  }

  getActiveRoom() {
    return this.activeRoom$.asObservable();
  }
}
