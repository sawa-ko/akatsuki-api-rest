import {
  Controller,
  Get,
  Param,
  Body,
  Res,
  HttpStatus,
  Patch,
  Delete,
  BadGatewayException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Rank } from 'src/decorators/rank.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/find/:userId')
  public getUser(@Param('userId') userId: string) {
    return this.userService.getPublicUser(userId);
  }

  @Patch('/update')
  public updateUser(@Body() updateUserDto: UpdateUserDto, @Res() response) {
    return this.userService.updateUser(updateUserDto).then(() => {
      response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Cambios guardados correctamente.',
      });
    });
  }

  @Get()
  protected async getAllUsers() {
    return await this.userService.getUsers();
  }

  @Rank('Administrator', 'Moderator')
  @Delete('/delete/:id')
  protected async deleteUser(@Param('id') id: string, @Res() res) {
    return await this.userService.deleteUser(id).then(() => {
      res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: 'User deleted successfully',
        id,
      });
    });
  }
}
