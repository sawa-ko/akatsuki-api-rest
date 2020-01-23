import { Ref } from '@typegoose/typegoose';

import { UserModel } from '../../../modules/user/models/user.model';
import { IsString, IsNotEmpty } from 'class-validator';

export class BuyerAddMarketDto {
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
}
