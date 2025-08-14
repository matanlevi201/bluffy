import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  hostId: string;
}
