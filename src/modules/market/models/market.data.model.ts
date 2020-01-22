import { prop, Ref } from '@typegoose/typegoose';
import { UserModel } from 'src/modules/user/models/user.model';

export class DiscountMarket {
  @prop({ required: true, min: 0, max: 99 })
  public percentage: number;

  @prop({ required: true })
  public exp: Date;
}

export class BuyerMarket {
  @prop({
    required: true,
    ref: 'Users',
  })
  public user: Ref<UserModel>;

  @prop({ required: true })
  public device: string | number;

  @prop({ required: true })
  public ip: string;
}

export class CommentMarket {
  @prop({
    required: true,
    ref: 'Users',
  })
  public author: Ref<UserModel>;

  @prop({ required: true })
  public device: string | number;

  @prop({ required: true })
  public ip: string;

  @prop({ required: true, minlength: 50, maxlength: 500 })
  public content: string;
}

export class ReactionsMarket {
  @prop({
    required: true,
    ref: 'Users',
  })
  public user: Ref<UserModel>;

  @prop({ required: true })
  public device: string | number;

  @prop({ required: true })
  public ip: string;

  @prop({ required: true })
  public type: number;
}
