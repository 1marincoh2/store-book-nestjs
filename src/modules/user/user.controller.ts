import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly _useService: UserService) {}

  @Get(':id')
  async getUser(@Param('id', ParseIntPipe) id: number): Promise<UserDto> {
    const user = await this._useService.get(id);
    return user;
  }

  @Get()
  async getUsers(): Promise<UserDto[]> {
    const users = await this._useService.getAll();
    return users;
  }
  @Post()
  async createUser(@Body() user: User): Promise<UserDto> {
    const createdUser = await this._useService.create(user);
    return createdUser;
  }

  @Patch(':id')
  async updateUser(@Param() id: number, @Body() user: User) {
    const UpdatedUser = await this._useService.update(id, user);
    return true;
  }

  @Delete(':id')
  async deleteUSer(@Param() id: number) {
    await this._useService.delite(id);
    return true;
  }
}
