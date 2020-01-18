import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { UserModel } from './models/user.model';
import { ReturnModelType } from '@typegoose/typegoose';
import { I18nRequestScopeService } from 'nestjs-i18n';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel)
    private readonly userModel: ReturnModelType<typeof UserModel>,
    private readonly i18nService: I18nRequestScopeService,
  ) {}

  public async getPublicUser(userId: string) {
    let user: UserModel;
    try {
      user = await this.userModel
        .findById(userId)
        .select([
          'offer',
          'photo',
          'cover',
          'stats',
          'online',
          'name',
          'username',
          'specialty',
          'reactions',
        ]);
    } catch (error) {
      throw new ConflictException(
        this.i18nService.translate('translations.auth.service.user_not_found'),
      );
    }

    if (!user) {
      throw new UnauthorizedException(
        this.i18nService.translate(
          'translations.auth.service.invalid_credentials',
        ),
      );
    }
    return user;
  }
}
