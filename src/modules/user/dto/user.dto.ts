import {
  Email,
  Password,
  Security,
  Suspension,
  Membership,
  Rank,
  Notifications,
  Online,
  Market,
  Reactions,
  Sessions,
  Stats,
  Transaction,
} from './user.dto.data';

export class UserDto {
  // tslint:disable-next-line
  public _id?: string;

  public name: string;

  public email: Email;

  public username: string;

  public password: Password;

  public offer: string;

  public specialty: string;

  public photo: string;

  public cover: string;

  public ip: string;

  public device: string;

  public tachi: number;

  public stats: Stats;

  public security: Security;

  public suspension: Suspension;

  public premium: Membership;

  public rank: Rank;

  public notifications: Notifications;

  public online: Online;

  public transactions: Transaction[];

  public market: Market[];

  public reactions: Reactions[];

  public sessions: Sessions[];
}
