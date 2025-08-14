import { Component, inject, OnInit, signal } from '@angular/core';
import { PlayersService } from '../../core/services/players.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Avatar } from '../../shared/ui/avatar/avatar';
import { CurrentUserService } from '../../core/services/current-user.service';
import { AddAvatarPipe } from '../../core/pipes/add-avatar-pipe';

@Component({
  selector: 'app-home',
  imports: [AsyncPipe, Avatar, CommonModule, AddAvatarPipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private playersService = inject(PlayersService);
  private currentUserService = inject(CurrentUserService);

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
}
