import { prop, modelOptions, arrayProp, index } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import {
  Market,
  Suspension,
  Stats,
  Security,
  Membership,
  Rank,
  Notifications,
  Reactions,
  Sessions,
  Password,
  Email,
  Online,
  Transaction,
} from './user.model.data';

@modelOptions({ options: { customName: 'Users' } })
@index({ email: 1, username: 1, device: 1, ip: 1 }, { unique: true })
export class UserModel extends TimeStamps {
  // tslint:disable-next-line
  public _id?: string;

  @prop({
    required: true,
    minlength: 5,
    maxlength: 30,
  })
  public name: string;

  @prop({ default: new Email(), _id: false })
  public email: Email;

  @prop({
    required: true,
    lowercase: true,
    trim: true,
    minlength: 5,
    maxlength: 15,
  })
  public username: string;

  @prop({ default: new Password(), _id: false })
  public password: Password;

  @prop({
    default:
      'Hello, welcome to my profile! At the moment I dont have offers available to offer to the public, or I dont have enough range to change this. :)',
    minlength: 140,
    maxlength: 1000,
  })
  public offer: string;

  @prop({
    required: true,
    minlength: 10,
    maxlength: 100,
  })
  public specialty: string;

  @prop({
    default:
      'https://api.akatsukiapp.com/uploads/placeholders/profile_photo.jpg',
    trim: true,
  })
  public photo: string;

  @prop({
    default: 'https://api.akatsukiapp.com/uploads/placeholders/cover_photo.jpg',
    trim: true,
  })
  public cover: string;

  @prop({ default: '127.0.0.1', trim: true })
  public ip: string;

  @prop({ required: true, trim: true })
  public device: string;

  @prop({ required: true, default: 0 })
  public tachi: number;

  @prop({ default: new Stats(), _id: false })
  public stats: Stats;

  @prop({ default: new Security(), _id: false })
  public security: Security;

  @prop({ default: new Suspension(), _id: false })
  public suspension: Suspension;

  @prop({ default: new Membership(), _id: false })
  public premium: Membership;

  @prop({ default: new Rank(), _id: false })
  public rank: Rank;

  @prop({ default: new Notifications(), _id: false })
  public notifications: Notifications;

  @prop({ default: new Online(), _id: false })
  public online: Online;

  @arrayProp({ items: Transaction })
  public transactions: Transaction[];

  @arrayProp({ items: Market })
  public market: Market[];

  @arrayProp({ items: Reactions })
  public reactions: Reactions[];

  @arrayProp({ items: Sessions })
  public sessions: Sessions[];
}
