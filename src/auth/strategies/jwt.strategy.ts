import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { InjectModel } from 'nestjs-typegoose';
import { UserModel } from '../../modules/user/models/user.model';
import { ReturnModelType } from '@typegoose/typegoose';
import { ConfigService } from '../../config/config.service';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { ConfigurationEnum } from '../../keys/configuration.enum';
import { UnauthorizedException, Injectable } from '@nestjs/common';
import { IJwtPayload } from '../jwt.payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(UserModel)
    private readonly userModel: ReturnModelType<typeof UserModel>,
    readonly configService: ConfigService,
    private readonly i18nService: I18nRequestScopeService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get(ConfigurationEnum.TOKEN_SECRET),
    });
  }

  async validate(payload: IJwtPayload) {
    const { id, username, email } = payload;
    const userExists = await this.userModel.findById(id);

    if (!userExists) {
      throw new UnauthorizedException(
        this.i18nService.translate('translations.auth.error.user_not_found'),
      );
    }

    if (userExists.username !== username) {
      throw new UnauthorizedException();
    }

    if (userExists.email.key !== email && !userExists.email.status) {
      throw new UnauthorizedException();
    }

    if (!userExists.password.status) {
      throw new UnauthorizedException();
    }

    if (userExists.suspension.status) {
      throw new UnauthorizedException(
        this.i18nService.translate(
          'translations.auth.error.suspension_account',
        ),
      );
    }

    return payload;
  }
}
