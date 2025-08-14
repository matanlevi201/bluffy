import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-room-input',
  imports: [],
  templateUrl: './room-input.html',
  styleUrl: './room-input.css',
})
export class RoomInput {
  @Input() value = '';
  @Input() placeholder = '# Enter Room Code...';
  @Input() buttonLabel = 'Join';

  @Output() valueChange = new EventEmitter<string>();
  @Output() submit = new EventEmitter<string>();

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.valueChange.emit(this.value);
  }

  onSubmit() {
    if (this.value) {
      this.submit.emit(this.value);
    }
  }
}
