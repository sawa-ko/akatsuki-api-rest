import {
  Controller,
  Put,
  UsePipes,
  ValidationPipe,
  Body,
  Res,
  HttpStatus,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { I18nService, I18nLang } from 'nestjs-i18n';
import { UserModel } from '../modules/user/models/user.model';
import { SignInDto } from './dto/signin.dto';
import { SecurityDto } from './dto/security.dto';
import { SecurityUpdateDto } from './dto/security.update.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly i18nService: I18nService,
  ) {}

  @Put('/signup')
  @UsePipes(new ValidationPipe())
  public async SignUp(
    @Body() user: UserModel,
    @Res() response,
    @I18nLang() lang: string,
  ) {
    await this.authService.SignUp(user);
    response.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      username: user.username,
      email: user.email,
      message: this.i18nService.translate(
        'translations.auth.controller.user_created',
        {
          lang,
        },
      ),
    });
  }

  @Post('/signin')
  public async SignIn(@Body() user: SignInDto) {
    return await this.authService.SignIn(user);
  }

  @Patch('/account/verify/email')
  public async VerifyAccount(
    @Body('userId') userId: string,
    @Body('token') token: string,
    @I18nLang() lang: string,
    @Res() response,
  ) {
    return await this.authService.VerifyEmail(userId, token).then(() => {
      response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: this.i18nService.translate(
          'translations.auth.controller.account_confirmation',
          {
            lang,
          },
        ),
      });
    });
  }

  @Post('/account/verify/security')
  public async VerifySecurity(
    @Body() security: SecurityDto,
    @I18nLang() lang: string,
    @Res() response,
  ) {
    return await this.authService.VerifySecurity(security).then(() => {
      response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: this.i18nService.translate(
          'translations.auth.controller.security_challenge_completed',
          {
            lang,
          },
        ),
      });
    });
  }

  @Post('/account/verify/session')
  public async VerifySession(
    @Body('userId') userId: string,
    @Body('sessioId') sessioId: string,
    @Body('sessionIp') sessioIp: string,
    @Body('sessionDevice') sessioDevice: string,
    @I18nLang() lang: string,
    @Res() response,
  ) {
    return await this.authService
      .VerifySession(userId, sessioDevice, sessioIp, sessioId)
      .then(() => {
        response.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          message: this.i18nService.translate(
            'translations.auth.controller.session_confirmation',
            {
              lang,
            },
          ),
        });
      });
  }

  @Post('/account/password/reset')
  public async PasswordResetRequest(
    @Body('userEmail') userEmail: string,
    @Body('userIp') userIp: string,
    @I18nLang() lang: string,
    @Res() response,
  ) {
    return await this.authService.SendPasswordReset(userEmail, userIp).then(() => {
      response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: this.i18nService.translate(
          'translations.auth.controller.password_reset',
          {
            lang,
          },
        ),
      });
    });
  }

  @Patch('/account/password/change')
  public async PasswordChange(
    @Body('userId') userId: string,
    @Body('tokenPassword') tokenPassword: string,
    @Body('newPassword') newPassword: string,
    @I18nLang() lang: string,
    @Res() response,
  ) {
    return await this.authService
      .ChangePassword(userId, tokenPassword, newPassword)
      .then(() => {
        response.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          message: this.i18nService.translate(
            'translations.auth.controller.change_password',
            {
              lang,
            },
          ),
        });
      });
  }

  @UseGuards(AuthGuard())
  @Patch('/account/security/change')
  public async ChangeSecurity(
    @Body() securityUpdate: SecurityUpdateDto,
    @GetUser('id') userIdRequest: string,
    @GetUser('rank') userRankRequest: string[],
    @I18nLang() lang: string,
    @Res() response,
  ) {
    return await this.authService
      .ChangeSecurity(securityUpdate, userIdRequest, userRankRequest)
      .then(() => {
        response.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          message: this.i18nService.translate(
            'translations.auth.controller.security_updated',
            {
              lang,
            },
          ),
        });
      });
  }

  @Post('/account/logout')
  public async LogOut(
    @Body('userId') userId: string,
    @Body('sesionId') sesionId: string,
    @I18nLang() lang: string,
    @Res() response,
  ) {
    return await this.authService.LogOut(userId, sesionId).then(() => {
      response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: this.i18nService.translate(
          'translations.auth.controller.session_logout',
          {
            lang,
          },
        ),
      });
    });
  }
}
