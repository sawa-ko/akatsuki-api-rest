import {
  modelOptions,
  prop,
  Ref,
  arrayProp,
  index,
} from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { UserModel } from '../../../modules/user/models/user.model';
import {
  DiscountMarket,
  BuyerMarket,
  CommentMarket,
  ReactionsMarket,
} from './market.data.model';

@modelOptions({
  options: {
    customName: 'Market',
  },
  schemaOptions: {
    collection: 'market',
  },
})
@index(
  {
    'buyer.device': 1,
    'buyer.ip': 1,
    'buyer.user._id': 1,
    'reactions.device': 1,
    'reactions.ip': 1,
    'reactions.user': 1,
  },
  { unique: true },
)
export class MarketModel extends TimeStamps {
  @prop({ required: true, minlength: 10, maxlength: 30 })
  public name: string;

  @prop({ required: true, minlength: 100, maxlength: 1000 })
  public description: string;

  @prop({ required: true, min: 1, max: 9999 })
  public price: number;

  @prop({ required: true })
  public available: boolean;

  @prop({ required: true })
  public status: boolean;

  @prop({ required: true, _id: false })
  public discount: DiscountMarket;

  @prop({ required: true })
  public market: number;

  @prop({ required: true })
  public ip: string;

  @prop({ required: true })
  public device: string | number;

  @arrayProp({ items: BuyerMarket })
  public buyers: BuyerMarket[];

  @arrayProp({ items: CommentMarket })
  public comments: CommentMarket[];

  @arrayProp({ items: ReactionsMarket })
  public reactions: ReactionsMarket[];

  @prop({
    required: true,
    ref: 'Users',
  })
  public author: Ref<UserModel>;
}
