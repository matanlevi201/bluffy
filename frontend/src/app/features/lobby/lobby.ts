import { Component, inject, OnInit, signal } from '@angular/core';
import { RoomsService } from '../../core/services/rooms.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { RoomInput } from '../../shared/ui/room-input/room-input';
import { CurrentUserService } from '../../core/services/current-user.service';
import { Avatar } from '../../shared/ui/avatar/avatar';
import { AddAvatarPipe } from '../../core/pipes/add-avatar-pipe';

@Component({
  selector: 'app-lobby',
  imports: [AsyncPipe, CommonModule, RoomInput, Avatar, AddAvatarPipe],
  templateUrl: './lobby.html',
  styleUrl: './lobby.css',
})
export class Lobby implements OnInit {
  private roomsService = inject(RoomsService);
  private currentUserService = inject(CurrentUserService);
  copied = signal(false);

  activeRoom$ = this.roomsService.getActiveRoom();
  currentUser$ = this.currentUserService.getCurrentUser();

  ngOnInit(): void {
    this.roomsService.loadActiveRoom().subscribe();
  }

  copyToClipboard(roomCode: string) {
    if (!roomCode) return;
    navigator.clipboard.writeText(roomCode).then(
      () => {
        this.copied.set(true);
        setTimeout(() => {
          this.copied.set(false);
        }, 2000);
      },
      (err) => {
        console.error('Failed to copy: ', err);
      }
    );
  }

  createRoom() {
    this.roomsService.createRoom().subscribe({
      next: () => this.roomsService.loadActiveRoom().subscribe(),
    });
  }

  handleSubmit(value: string) {
    console.log(value);
  }
}
