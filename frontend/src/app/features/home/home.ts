import { Component, inject, OnInit, signal } from '@angular/core';
import { PlayersService } from '../../core/services/players.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Avatar } from '../../shared/ui/avatar/avatar';
import { CurrentUserService } from '../../core/services/current-user.service';
import { AddAvatarPipe } from '../../core/pipes/add-avatar-pipe';
import { RoomsService } from '../../core/services/rooms.service';
import { RoomInput } from '../../shared/ui/room-input/room-input';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [AsyncPipe, Avatar, CommonModule, AddAvatarPipe, RoomInput],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private playersService = inject(PlayersService);
  private currentUserService = inject(CurrentUserService);
  private roomsService = inject(RoomsService);
  private router = inject(Router);

  players$ = this.playersService.getPlayers();
  currentUser$ = this.currentUserService.getCurrentUser();

  roomCode = signal<string | null>(null);

  ngOnInit(): void {
    this.playersService.loadPlayers().subscribe();
  }

  updateField(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    if (input) {
      this.roomCode.set(input.value);
    }
  }

  createRoom() {
    this.roomsService
      .createRoom()
      .subscribe({ next: () => this.router.navigate(['lobby']) });
  }

  handleSubmit(value: string) {
    console.log(value);
  }
}
