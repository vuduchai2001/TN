import { ApiProperty } from '@nestjs/swagger';

export class FindReq {
  @ApiProperty({
    required: false,
    name: 'page',
  })
  page?: number;
  @ApiProperty({
    required: false,
    name: 'size',
  })
  size?: number;
}
