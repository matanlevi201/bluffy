import { Component, inject, OnInit } from '@angular/core';
import { RoomsService } from '../../core/services/rooms.service';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-lobby',
  imports: [AsyncPipe, CommonModule],
  templateUrl: './lobby.html',
  styleUrl: './lobby.css',
})
export class Lobby implements OnInit {
  private roomsService = inject(RoomsService);

  activeRoom$ = this.roomsService.getActiveRoom();

  ngOnInit(): void {
    this.roomsService.loadActiveRoom().subscribe();
  }
}
