import { prop, Ref } from '@typegoose/typegoose';
import { UserModel } from '../../../modules/user/models/user.model';

export class ChangelogAuthor {
  @prop({
    required: true,
    ref: 'Users',
  })
  public info: Ref<UserModel>;

  @prop({ required: true })
  public device: string | number;

  @prop({ required: true })
  public ip: string;
}
