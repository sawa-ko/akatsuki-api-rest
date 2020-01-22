export class Market {
  public description: string;

  public price: number;

  public type: number;

  public discount: number;

  public seller: string;

  public device: number;

  public ip: string;

  public market: number;
}

export class Reactions {
  public author: string;

  public type: number;
}

export class Suspension {
  public status: boolean;

  public reason: string;
}

export class Stats {
  public spent: number;

  public won: number;

  public rewards: number;

  public rep: number;

  public exp: number;
}

export class Security {
  public enabled: boolean;

  public code1: number;

  public code2: number;

  public code3: number;

  public code4: number;

  public code5: number;

  public twofactor: number;
}

export class Membership {
  public status: false;

  public expiration: Date;

  public transaction: Date;
}

export class Rank {
  public seller: boolean;

  public mod: boolean;

  public admin: boolean;
}

export class Notifications {
  public social: boolean;

  public market: boolean;

  public message: boolean;
}

export class Online {
  public online: boolean;

  public mode: number;

  public last: Date;
}

export class Sessions {
  // tslint:disable-next-line
  public _id?: string;

  public device: string | number;

  public ip: string;

  public twofactor: boolean;
}

export class Email {
  public key: string;

  public status: boolean;

  public token: string;

  public expiration?: Date;
}

export class Password {
  public key: string;

  public status?: boolean;

  public token?: string;

  public expiration?: Date;
}

export class TransactionBuyer {
  public id: string;

  public ip: string;

  public device: string;
}
export class Transaction {
  // tslint:disable-next-line
  public _id?: string;

  public seller: string;

  public buyer: TransactionBuyer;

  public item: string;

  public type: number;

  public price: number;

  public discount: number;

  public market: number;
}
