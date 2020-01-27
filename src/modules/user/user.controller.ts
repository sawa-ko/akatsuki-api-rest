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
  UseGuards,
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
import { I18nService, I18nLang } from 'nestjs-i18n';
import { AuthGuard } from '@nestjs/passport';
import { RanksEnum } from '../../keys/ranks.enum';
import { GetUser } from '../../decorators/user.decorator';

@UseGuards(AuthGuard())
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly i18nService: I18nService,
  ) { }

  @Get('/find/:userId')
  public getUser(
    @Param('userId') userId: string,
    @GetUser('id') userRequestId: string,
  ) {
    return this.userService.getPublicUser(userId, userRequestId);
  }

  @Patch('/update')
  public async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Res() response,
    @I18nLang() lang: string,
    @GetUser('id') userRequestId: string,
    @GetUser('rank') userRequestRank: string[],
  ) {
    await this.userService.updateUser(
      updateUserDto,
      userRequestId,
      userRequestRank,
    );
    response.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: this.i18nService.translate('translations.general.saved', {
        lang,
      }),
    });
  }

  @Get()
  protected async getAllUsers() {
    return await this.userService.getUsers();
  }

  @Get('/best/sellers')
  protected async getBestSellers() {
    return await this.userService.getBestSellers();
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
    @I18nLang() lang: string,
    @GetUser('id') userRequestId: string,
    @GetUser('rank') userRequestRank: string[],
  ) {
    return await this.userService
      .updatePhoto(
        id,
        `${this.configService.get(
          ConfigurationEnum.SERVER_HOST,
        )}/uploads/profile_photo/${file.filename}`,
        'photo',
        userRequestId,
        userRequestRank,
      )
      .then(() => {
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          message: this.i18nService.translate(
            'translations.user.controller.profile_photo_updated',
            {
              lang,
            },
          ),
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
    @I18nLang() lang: string,
    @GetUser('id') userRequestId: string,
    @GetUser('rank') userRequestRank: string[],
  ) {
    return await this.userService
      .updatePhoto(
        id,
        `${this.configService.get(
          ConfigurationEnum.SERVER_HOST,
        )}/uploads/${id}/cover_photo/${file.filename}`,
        'cover',
        userRequestId,
        userRequestRank,
      )
      .then(() => {
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          message: this.i18nService.translate(
            'translations.user.controller.cover_photo_updated',
            {
              lang,
            },
          ),
          path: `${this.configService.get(
            ConfigurationEnum.SERVER_HOST,
          )}/uploads/cover_photo/${file.filename}`,
        });
      });
  }

  @Put('/reactions/add')
  protected async addReaction(
    @Res() res,
    @Body() reactionsDto: ReactionsDto,
    @I18nLang() lang: string,
  ) {
    return await this.userService.addReaction(reactionsDto).then(() => {
      res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: this.i18nService.translate(
          'translations.user.controller.reaction_added',
          {
            lang,
          },
        ),
      });
    });
  }

  @Rank(RanksEnum.ADMINISTRATOR)
  @Delete('/reactions/remove')
  protected async removeReaction(
    @Res() res,
    @Body('toId') toId: string,
    @Body('ofId') ofId: string,
    @I18nLang() lang: string,
  ) {
    return await this.userService.removeReaction(ofId, toId).then(() => {
      res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: this.i18nService.translate(
          'translations.user.controller.reactions_deleted',
          {
            lang,
          },
        ),
      });
    });
  }
}
