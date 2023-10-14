import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LogoutDto {
  @IsString()
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  accessToken: string;

  @IsString()
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  refreshToken: string;
}
