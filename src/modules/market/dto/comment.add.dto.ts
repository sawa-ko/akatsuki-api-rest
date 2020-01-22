import { Ref } from '@typegoose/typegoose';

import { UserModel } from '../../user/models/user.model';

export class CommentMarketDto {
  public product: string;

  public user: Ref<UserModel>;

  public device: string | number;

  public ip: string;

  public content: string;
}
