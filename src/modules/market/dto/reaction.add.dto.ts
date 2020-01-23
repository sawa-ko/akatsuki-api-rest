import { Ref } from '@typegoose/typegoose';

import { UserModel } from '../../../modules/user/models/user.model';
import { IsNotEmpty, IsString } from 'class-validator';

export class ReactionAddMarketDto {
  @IsNotEmpty()
  @IsString()
  public product: string;

  @IsNotEmpty()
  @IsString()
  public user: Ref<UserModel>;

  @IsNotEmpty()
  @IsString()
  public device: string | number;

  @IsNotEmpty()
  @IsString()
  public ip: string;

  @IsNotEmpty()
  @IsString()
  public type: number;
}
