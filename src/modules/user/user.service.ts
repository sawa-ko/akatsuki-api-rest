import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { UserModel } from './models/user.model';
import { ReturnModelType } from '@typegoose/typegoose';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel)
    private readonly userModel: ReturnModelType<typeof UserModel>,
    private readonly i18nService: I18nRequestScopeService,
  ) {}

  public async getPublicUser(userId: string): Promise<UserModel> {
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

  public async updateUser(updateUserDto: UpdateUserDto): Promise<UserModel> {
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
        this.i18nService.translate(
          'translations.auth.service.invalid_credentials',
        ),
      );
    }

    if (blockKey.includes(key)) {
      throw new ForbiddenException(
        'La cuenta no tiene permisos suficientes para completar esta accion.',
      );
    }

    return await this.userModel.findByIdAndUpdate(id, {
      [key]: value,
    });
  }

  public async updateOnlineUser(
    id: string,
    online: { online: { online: boolean; mode: number; last: Date } },
  ): Promise<UserModel> {
    return await this.userModel.findByIdAndUpdate(id, online);
  }

  public async updatePhoto(
    id: string,
    dir: string,
    type: string,
  ): Promise<void> {
    if (!id) {
      throw new BadRequestException('Id is required.');
    }

    if (!type) {
      throw new BadRequestException('Type is required.');
    }

    if (!type) {
      throw new BadRequestException('Type for the photo is required.');
    }

    if (type === 'photo') {
      await this.userModel.findByIdAndUpdate(id, { photo: dir });
    }

    if (type === 'cover') {
      await this.userModel.findByIdAndUpdate(id, { cover: dir });
    }
  }

  public async addReaction(
    id: string,
    type: string,
    userId: string,
  ): Promise<void> {
    const user = await this.userModel.findById(id);
    if (type === 'upvote') {
      user.reactions.push({ id: userId, type: 0 });
      await user.save();
    }

    if (type === 'downvote') {
      user.reactions.push({ id: userId, type: 1 });
      await user.save();
    }
  }

  public async removeReaction(
    username: string,
    id: string,
  ): Promise<UserModel> {
    return await this.userModel.findOneAndUpdate(
      id,
      {
        $pull: { reactions: { username } },
      },
      { new: true },
    );
  }

  public async deleteUser(id: string): Promise<void> {
    return await this.userModel.findByIdAndDelete(id).catch(() => {
      throw new BadRequestException(
        'Ocurrio un problema al procesar la solicitud de eliminacion de miembro.',
      );
    });
  }
}
