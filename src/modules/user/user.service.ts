import {
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { UserModel } from './models/user.model';
import { ReturnModelType } from '@typegoose/typegoose';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { UpdateUserDto } from './dto/update-user.dto';
import { ReactionsDto } from './dto/reactions.dto';
import { RanksEnum } from 'src/keys/ranks.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel)
    private readonly userModel: ReturnModelType<typeof UserModel>,
    private readonly i18nService: I18nRequestScopeService,
  ) {}

  public async getPublicUser(userId: string, userRequestId: string): Promise<UserModel> {
    let user: UserModel;
    try {
      if (userRequestId === userId) {
        user = await this.userModel
        .findById(userId)
        .select([
          'email.key',
          'password.key',
          'offer',
          'photo',
          'cover',
          'stats',
          'online',
          'name',
          'username',
          'specialty',
          'reactions',
          'tachi',
          'security',
          'premium',
          'notifications',
          'transactions',
          'market',
          'sessions',
          'rank',
        ]);
      } else {
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
          'rank',
        ]);
      }
    } catch (error) {
      throw new ConflictException(
        this.i18nService.translate('translations.auth.service.user_not_found'),
      );
    }

    if (!user) {
      throw new UnauthorizedException(
        this.i18nService.translate('translations.auth.service.user_not_found'),
      );
    }
    return user;
  }

  public async getUsers() {
    return await this.userModel
      .find()
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
      ])
      .exec();
  }

  public async updateUser(
    updateUserDto: UpdateUserDto,
    requetUserId: string,
    requestUserRank: string[],
  ): Promise<UserModel> {
    let user: UserModel;
    const { id, key, value } = updateUserDto;
    const blockKey: string[] = [
      'email.status',
      'email.expiration',
      'email.token',
      'password.status',
      'password.expiration',
      'password.token',
      'ip',
      'tachi',
      'stats',
      'suspension',
      'premium',
      'rank',
      'transactions',
      'market',
      'device',
      'reactions',
      'sessions',
      'createdAt',
      'updatedAt',
      '__v',
    ];
    try {
      user = await this.userModel.findById(id);
    } catch (error) {
      throw new ConflictException(
        this.i18nService.translate('translations.auth.service.user_not_found'),
      );
    }

    if (!user) {
      throw new UnauthorizedException(
        this.i18nService.translate('translations.auth.service.user_not_found'),
      );
    }

    if (blockKey.includes(key)) {
      throw new ForbiddenException(
        this.i18nService.translate(
          'translations.general.account_no_permission',
        ),
      );
    }

    if (requetUserId !== id) {
      if (
        !requestUserRank.includes(RanksEnum.ADMINISTRATOR) &&
        !requestUserRank.includes(RanksEnum.MODERATOR)
      ) {
        throw new ForbiddenException(
          this.i18nService.translate(
            'translations.general.account_no_permission',
          ),
        );
      }
    }

    return await this.userModel
      .findByIdAndUpdate(id, {
        [key]: value,
      })
      .catch(() => {
        throw new BadRequestException(
          this.i18nService.translate('translations.general.process_failed'),
        );
      });
  }

  public async updateOnlineUser(
    id: string,
    online: { online: { online: boolean; mode: number; last: Date } },
  ): Promise<UserModel> {
    return await this.userModel.findByIdAndUpdate(id, online).catch(() => {
      throw new BadRequestException(
        this.i18nService.translate('translations.general.process_failed'),
      );
    });
  }

  public async updatePhoto(
    userId: string,
    dir: string,
    type: string,
    requetUserId: string,
    requestUserRank: string[],
  ): Promise<void> {
    let user: UserModel;
    try {
      user = await this.userModel.findById(userId);
    } catch (error) {
      throw new ConflictException(
        this.i18nService.translate('translations.auth.service.user_not_found'),
      );
    }

    if (!user) {
      throw new UnauthorizedException(
        this.i18nService.translate('translations.auth.service.user_not_found'),
      );
    }

    if (requetUserId !== userId) {
      if (
        !requestUserRank.includes(RanksEnum.ADMINISTRATOR) &&
        !requestUserRank.includes(RanksEnum.MODERATOR)
      ) {
        throw new ForbiddenException(
          this.i18nService.translate(
            'translations.general.account_no_permission',
          ),
        );
      }
    }

    if (!type) {
      throw new BadRequestException(
        this.i18nService.translate('translations.user.service.type_photo'),
      );
    }

    if (type === 'photo') {
      await this.userModel
        .findByIdAndUpdate(userId, { photo: dir })
        .catch(() => {
          throw new BadRequestException(
            this.i18nService.translate('translations.general.process_failed'),
          );
        });
    }

    if (type === 'cover') {
      await this.userModel
        .findByIdAndUpdate(userId, { cover: dir })
        .catch(() => {
          throw new BadRequestException(
            this.i18nService.translate('translations.general.process_failed'),
          );
        });
    }
  }

  public async addReaction(reactionsDto: ReactionsDto): Promise<void> {
    const { toId, ofId, type } = reactionsDto;
    let user;
    try {
      user = await this.userModel.findById(toId);
    } catch (error) {
      throw new ConflictException(
        this.i18nService.translate('translations.auth.service.user_not_found'),
      );
    }

    if (!user) {
      throw new NotFoundException(
        this.i18nService.translate('translations.auth.service.user_not_found'),
      );
    }
    if (type === 'upvote') {
      user.reactions.push({ author: ofId, type: 0 });
      await user.save().catch(error => {
        throw new BadRequestException(error);
      });
    }

    if (type === 'downvote') {
      user.reactions.push({ author: ofId, type: 1 });
      await user.save().catch(() => {
        throw new BadRequestException(
          this.i18nService.translate('translations.general.process_failed'),
        );
      });
    }
  }

  public async removeReaction(OfId: string, toId: string): Promise<UserModel> {
    return await this.userModel
      .findOneAndUpdate(
        toId,
        {
          $pull: { reactions: { author: OfId } },
        },
        { new: true },
      )
      .catch(() => {
        throw new BadRequestException(
          this.i18nService.translate('translations.general.process_failed'),
        );
      });
  }

  public async deleteUser(id: string): Promise<void> {
    return await this.userModel.findByIdAndDelete(id).catch(() => {
      throw new BadRequestException(
        this.i18nService.translate('translations.general.process_failed'),
      );
    });
  }
}
