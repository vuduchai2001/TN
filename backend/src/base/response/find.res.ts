import { ApiProperty } from '@nestjs/swagger';

export class FindRes<T> {
  @ApiProperty({
    required: false,
    name: 'data',
  })
  data?: T[];
  @ApiProperty({
    required: false,
    name: 'page',
  })
  page?: number;
  @ApiProperty({
    required: false,
    name: 'page',
  })
  size?: number;
  @ApiProperty({
    required: false,
    name: 'total',
  })
  total?: number;
}
