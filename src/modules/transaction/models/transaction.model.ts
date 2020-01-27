import { modelOptions, index, prop, Ref } from '@typegoose/typegoose';
import { MarketModel } from '../../../modules/market/models/market.model';
import { UserModel } from '../../../modules/user/models/user.model';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

@modelOptions({
  options: {
    customName: 'Transactions',
  },
  schemaOptions: {
    collection: 'transactions',
  },
})
export class TransactionModel extends TimeStamps {
  @prop({
    required: true,
    ref: 'Market',
  })
  public product: Ref<MarketModel>;

  @prop({
    required: true,
    ref: 'Users',
  })
  public buyer: Ref<UserModel>;

  @prop({
    ref: 'Users',
  })
  public seller?: Ref<UserModel>;

  @prop({ required: true })
  public device: string | number;

  @prop({ required: true })
  public ip: string;
}
