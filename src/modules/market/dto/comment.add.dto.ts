import { Ref } from '@typegoose/typegoose';

import { UserModel } from '../../user/models/user.model';
import { IsNotEmpty, IsString } from 'class-validator';

export class CommentMarketDto {
  @IsNotEmpty()
  @IsString()
  public product: string;

  @IsNotEmpty()
  @IsString()
  public user: Ref<UserModel>;

  @IsNotEmpty()
  public device: string | number;

  @IsNotEmpty()
  @IsString()
  public ip: string;

  @IsNotEmpty()
  @IsString()
  public content: string;
}
