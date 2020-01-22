import { prop, index } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export class Reactions {
  /*@prop({
    required: true,
    lowercase: true,
    trim: true,
  })
  public author: string;*/

  @prop({ required: true, min: 0, max: 1 })
  public type: number;
}

export class Suspension {
  @prop({ required: true, default: false })
  public status: boolean;

  @prop({
    required: true,
    default:
      '[System]: The reason for suspension has not been specified. Please contact us for more information.',
    minlength: 90,
    maxlength: 200,
  })
  public reason: string;
}

export class Stats {
  @prop({ required: true, default: 0 })
  public spent: number;

  @prop({ required: true, default: 0 })
  public won: number;

  @prop({ required: true, default: 0 })
  public rewards: number;

  @prop({ required: true, default: 0 })
  public rep: number;

  @prop({ required: true, default: 0 })
  public exp: number;
}

export class Security {
  @prop({ required: true, default: false })
  public enabled: boolean;

  @prop({ required: true, default: 0 })
  public code1: number;

  @prop({ required: true, default: 0 })
  public code2: number;

  @prop({ required: true, default: 0 })
  public code3: number;

  @prop({ required: true, default: 0 })
  public code4: number;

  @prop({ required: true, default: 0 })
  public code5: number;

  @prop({ required: true, default: 0 })
  public twofactor: number;
}

export class Membership {
  @prop({ required: true, default: false })
  public status: false;

  @prop({ required: true, default: Date.now() })
  public expiration: Date;

  @prop({ required: true, default: Date.now() })
  public transaction: Date;
}

export class Rank {
  @prop({ required: true, default: false })
  public seller: boolean;

  @prop({ required: true, default: false })
  public mod: boolean;

  @prop({ required: true, default: false })
  public admin: boolean;
}

export class Notifications {
  @prop({ required: true, default: false })
  public social: boolean;

  @prop({ required: true, default: false })
  public market: boolean;

  @prop({ required: true, default: false })
  public message: boolean;
}

export class Online {
  @prop({ required: true, default: false })
  public online: boolean;

  @prop({ required: true, default: 0 })
  public mode: number;

  @prop({ required: true, default: Date.now() })
  public last: Date;
}

@index({ device: 1, ip: 1 }, { unique: true })
export class Sessions extends TimeStamps {
  // tslint:disable-next-line
  public _id?: string;

  @prop({ required: true })
  public device: string | number;

  @prop({ required: true })
  public ip: string;

  @prop({ required: true, default: false })
  public twofactor: boolean;
}

export class Email {
  @prop({ required: true, trim: true })
  public key: string;

  @prop({ required: true, default: false })
  public status: boolean;

  @prop({ required: true })
  public token: string;

  @prop({ required: true, default: Date.now() })
  public expiration?: Date;
}

export class Password {
  @prop({ required: true, trim: true })
  public key: string;

  @prop({ required: true, default: true })
  public status?: boolean;

  @prop({ required: true })
  public token?: string;

  @prop({ required: true, default: Date.now() })
  public expiration?: Date;
}

export class TransactionBuyer {
  @prop({ required: true })
  public id: string;

  @prop({ required: true })
  public ip: string;

  @prop({ required: true })
  public device: string;
}

export class Transaction extends TimeStamps {
  // tslint:disable-next-line
  public _id?: string;

  @prop({ required: true })
  public seller: string;

  @prop({ default: new TransactionBuyer(), _id: false })
  public buyer: TransactionBuyer;

  @prop({ required: true })
  public item: string;

  @prop({ required: true })
  public type: number;

  @prop({ required: true })
  public price: number;

  @prop({ required: true })
  public discount: number;

  @prop({ required: true })
  public market: number;
}
