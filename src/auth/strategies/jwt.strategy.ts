import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { InjectModel } from 'nestjs-typegoose';
import { UserModel } from '../../modules/user/models/user.model';
import { ReturnModelType } from '@typegoose/typegoose';
import { ConfigService } from '../../config/config.service';
import { ConfigurationEnum } from '../../keys/configuration.enum';
import { UnauthorizedException, Injectable } from '@nestjs/common';
import { IJwtPayload } from '../jwt.payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(UserModel)
    private readonly userModel: ReturnModelType<typeof UserModel>,
    readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get(ConfigurationEnum.TOKEN_SECRET),
    });
  }

  async validate(payload: IJwtPayload) {
    const { id, username, email } = payload;
    const userExists = await this.userModel.findById(id);

    if (!userExists) {
      throw new UnauthorizedException(
        'This user does not exist. Please verify that the request is correct.',
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
        'We are sorry but this account does not have sufficient permissions to use Akatsuki Project.',
      );
    }

    return payload;
  }
}
