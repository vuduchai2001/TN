import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { UserService } from './services/user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FindReq } from 'src/base/dto/find.dto';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(@Query() payload: FindReq) {
    return await this.userService.findAll(payload);
  }

  @Get('/:id')
  async findById(@Param() id?: number) {
    return await this.userService.findById(id);
  }

  @Post()
  async create(@Body() payload: any) {
    return await this.userService.create(payload);
  }

  @Patch('/:id')
  async update(@Param('id') id: number, @Body() payload: any) {
    return await this.userService.update(id, payload);
  }

  @Delete('/:id')
  async delete(@Param('id') id: number) {
    return await this.userService.delete(id);
  }
}
