import { Pipe, PipeTransform } from '@angular/core';
import { Player } from '../services/players.service';
import { generateAvatar } from '../../utils/helpers';

@Pipe({
  name: 'addAvatar',
})
export class AddAvatarPipe implements PipeTransform {
  transform(player: Player): (Player & { avatar: string }) | null {
    if (!player) return null;
    return {
      ...player,
      avatar: generateAvatar(player.id),
    };
  }
}
