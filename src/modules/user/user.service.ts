import {
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
  Injectable,
  NotFoundException,
  Logger,
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
  private readonly logger: Logger = new Logger('User');

  constructor(
    @InjectModel(UserModel)
    private readonly userModel: ReturnModelType<typeof UserModel>,
    private readonly i18nService: I18nRequestScopeService,
  ) {}

  public async getPublicUser(
    userId: string,
    userRequestId: string,
  ): Promise<UserModel> {
    let user: UserModel;
    try {
      if (userRequestId === userId) {
        this.logger.log(
          `Obtaining private information from the user ${userId} by the user ${userRequestId}.`,
        );
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
        this.logger.log(
          `Obtaining public information of the user ${userId} by the user ${userRequestId}.`,
        );
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
      this.logger.error(
        `Could not get user information ${userId} by user ${userRequestId} because the user does not exist.`,
      );
      throw new ConflictException(
        this.i18nService.translate('translations.auth.service.user_not_found'),
      );
    }

    if (!user) {
      this.logger.error(
        `Could not get user information ${userId} by user ${userRequestId} because the user does not exist.`,
      );
      throw new UnauthorizedException(
        this.i18nService.translate('translations.auth.service.user_not_found'),
      );
    }
    return user;
  }

  public async getUsers() {
    this.logger.log(
      'Obtaining list of all users registered in Akatsuki Project.',
    );
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
    this.logger.log(
      `Updating the user ${updateUserDto.id} by the user ${requetUserId}.`,
    );
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
      this.logger.error(
        `Could not update user ${id} by user ${requetUserId} because the user does not exist.`,
      );
      throw new ConflictException(
        this.i18nService.translate('translations.auth.service.user_not_found'),
      );
    }

    if (!user) {
      this.logger.error(
        `Could not update user ${id} by user ${requetUserId} because the user does not exist.`,
      );
      throw new UnauthorizedException(
        this.i18nService.translate('translations.auth.service.user_not_found'),
      );
    }

    if (blockKey.includes(key)) {
      this.logger.error(
        `Could not update user ${id} by user ${requetUserId} because he does not have sufficient permissions to update the ${key} key with the value ${value}.`,
      );
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
        this.logger.error(
          `Could not update user ${id} by user ${requetUserId} because the user who wants to update does not have sufficient permissions on the account.`,
        );
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
        this.logger.error(
          `Could not update user ${id} by user ${requetUserId} due to a system error.`,
        );
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
    this.logger.log(
      `Updating profile picture of ${userId} by user ${requetUserId}.`,
    );
    let user: UserModel;
    try {
      user = await this.userModel.findById(userId);
    } catch (error) {
      throw new ConflictException(
        this.i18nService.translate('translations.auth.service.user_not_found'),
      );
    }

    if (!user) {
      this.logger.error(
        `Could not update user ${userId} by user ${requetUserId} because the user does not exist.`,
      );
      throw new UnauthorizedException(
        this.i18nService.translate('translations.auth.service.user_not_found'),
      );
    }

    if (requetUserId !== userId) {
      if (
        !requestUserRank.includes(RanksEnum.ADMINISTRATOR) &&
        !requestUserRank.includes(RanksEnum.MODERATOR)
      ) {
        this.logger.error(
          `Could not update user ${userId} by user ${requetUserId} because the user who wants to update does not have sufficient permissions on the account.`,
        );
        throw new ForbiddenException(
          this.i18nService.translate(
            'translations.general.account_no_permission',
          ),
        );
      }
    }

    if (!type) {
      this.logger.error(
        `Could not update profile picture of ${userId} by user ${requetUserId} because the type of photo to update was not specified.`,
      );
      throw new BadRequestException(
        this.i18nService.translate('translations.user.service.type_photo'),
      );
    }

    if (type === 'photo') {
      await this.userModel
        .findByIdAndUpdate(userId, { photo: dir })
        .catch(() => {
          this.logger.error(
            `Could not update profile picture of ${userId} by user ${requetUserId} due to a system error.`,
          );
          throw new BadRequestException(
            this.i18nService.translate('translations.general.process_failed'),
          );
        });
    }

    if (type === 'cover') {
      await this.userModel
        .findByIdAndUpdate(userId, { cover: dir })
        .catch(() => {
          this.logger.error(
            `Could not update the cover photo of ${userId} by user ${requetUserId} due to a system error.`,
          );
          throw new BadRequestException(
            this.i18nService.translate('translations.general.process_failed'),
          );
        });
    }
  }

  public async addReaction(reactionsDto: ReactionsDto): Promise<void> {
    const { toId, ofId, type } = reactionsDto;
    this.logger.error(
      `Adding new reaction to user ${toId} by user ${ofId} with reaction type $ {type}.`,
    );
    let user;
    try {
      user = await this.userModel.findById(toId);
    } catch (error) {
      this.logger.error(
        `The process of adding reaction to user ${toId} by user ${ofId} could not be completed because the user does not exist.`,
      );
      throw new ConflictException(
        this.i18nService.translate('translations.auth.service.user_not_found'),
      );
    }

    if (!user) {
      this.logger.error(
        `The process of adding reaction to user ${toId} by user ${ofId} could not be completed because the user does not exist.`,
      );
      throw new NotFoundException(
        this.i18nService.translate('translations.auth.service.user_not_found'),
      );
    }
    if (type === 'upvote') {
      user.reactions.push({ author: ofId, type: 0 });
      await user.save().catch(error => {
        this.logger.error(
          `Could not add user reaction ${ofId} to user ${toId} due to a system error.`,
        );
        throw new BadRequestException(
          this.i18nService.translate('translations.general.process_failed'),
        );
      });
    }

    if (type === 'downvote') {
      user.reactions.push({ author: ofId, type: 1 });
      await user.save().catch(() => {
        this.logger.error(
          `Could not add user reaction ${ofId} to user ${toId} due to a system error.`,
        );
        throw new BadRequestException(
          this.i18nService.translate('translations.general.process_failed'),
        );
      });
    }
  }

  public async removeReaction(ofId: string, toId: string): Promise<UserModel> {
    this.logger.error(`Eliminando reaccion de ${ofId} por el usuario ${toId}.`);
    return await this.userModel
      .findOneAndUpdate(
        toId,
        {
          $pull: { reactions: { author: ofId } },
        },
        { new: true },
      )
      .catch(() => {
        this.logger.error(
          `Could not remove user reaction ${ofId} to user ${toId} due to a system error.`,
        );
        throw new BadRequestException(
          this.i18nService.translate('translations.general.process_failed'),
        );
      });
  }

  public async deleteUser(id: string): Promise<void> {
    return await this.userModel.findByIdAndDelete(id).catch(() => {
      this.logger.error(
        `The user ${id} could not be deleted due to a system error.`,
      );
      throw new BadRequestException(
        this.i18nService.translate('translations.general.process_failed'),
      );
    });
  }
}
