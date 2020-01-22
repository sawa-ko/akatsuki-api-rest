import { Ref } from '@typegoose/typegoose';

import { UserModel } from '../../../modules/user/models/user.model';

export class BuyerAddMarketDto {
  public product: string;

  public user: Ref<UserModel>;

  public device: string | number;

  public ip: string;
}