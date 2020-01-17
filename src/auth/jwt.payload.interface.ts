export interface IJwtPayload {
  id: string;
  email: string;
  username: string;
  rank: string[];
  lat?: Date;
}
