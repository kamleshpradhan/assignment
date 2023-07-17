import { Controller, Get, Post, Delete } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  testingRoute() {
    return this.usersService.sayHello();
  }

  @Post('/create_users')
  createUser() {
    return this.usersService.createUser();
  }

  @Post('/read_users')
  readUser() {
    return this.usersService.readUsers();
  }

  @Post('/update_users')
  updateUser() {
    return this.usersService.updateUser();
  }

  @Delete('/delete_users')
  deleteUser() {
    return this.usersService.deleteUser();
  }
}
