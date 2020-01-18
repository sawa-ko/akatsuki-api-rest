import {
  Controller,
  Get,
  Param,
  Body,
  Res,
  HttpStatus,
  Patch,
  Delete,
  Post,
  UseInterceptors,
  UploadedFile,
  Put,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Rank } from '../../decorators/rank.decorator';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { ConfigurationEnum } from '../../keys/configuration.enum';
import { ConfigService } from '../../config/config.service';
import { ReactionsDto } from './dto/reactions.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

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

  @Post('/upload/photo/:id')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/profile_photo',
        // tslint:disable-next-line: variable-name
        filename: (_req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  protected async changeProfilePhoto(
    @UploadedFile() file,
    @Param('id') id: string,
    @Res() res,
  ) {
    return await this.userService
      .updatePhoto(
        id,
        `${this.configService.get(
          ConfigurationEnum.SERVER_HOST,
        )}/uploads/profile_photo/${file.filename}`,
        'profile_photo',
      )
      .then(() => {
        res.status(HttpStatus.OK).json({
          status: HttpStatus.OK,
          message: 'Profile photo updated successfully',
          path: `${this.configService.get(
            ConfigurationEnum.SERVER_HOST,
          )}/uploads/profile_photo/${file.filename}`,
        });
      });
  }

  @UseInterceptors(
    FileInterceptor('cover', {
      storage: diskStorage({
        destination: './uploads/cover_photo',
        // tslint:disable-next-line: variable-name
        filename: (_req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @Post('/upload/cover/:id')
  protected async changeCoverPhoto(
    @UploadedFile() file,
    @Param('id') id: string,
    @Res() res,
  ) {
    return await this.userService
      .updatePhoto(
        id,
        `${this.configService.get(
          ConfigurationEnum.SERVER_HOST,
        )}/uploads/${id}/cover_photo/${file.filename}`,
        'cover_photo',
      )
      .then(() => {
        res.status(HttpStatus.OK).json({
          status: HttpStatus.OK,
          message: 'Cover photo updated successfully',
          path: `${this.configService.get(
            ConfigurationEnum.SERVER_HOST,
          )}/uploads/${id}/cover_photo/${file.filename}`,
        });
      });
  }

  @Put('/reactions/add')
  protected async addReaction(@Res() res, @Body() reactionsDto: ReactionsDto) {
    return await this.userService.addReaction(reactionsDto).then(() => {
      res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: 'Reaction added successfully.',
      });
    });
  }

  @Delete('/reactions/remove')
  protected async removeReaction(
    @Res() res,
    @Body('toId') toId: string,
    @Body('ofId') ofId: string,
  ) {
    return await this.userService.removeReaction(ofId, toId).then(() => {
      res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: 'Reaction removed successfully.',
      });
    });
  }
}
