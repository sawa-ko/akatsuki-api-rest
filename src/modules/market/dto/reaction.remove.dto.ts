import { IsNotEmpty, IsString } from 'class-validator';

export class ReactionRemoveMarketDto {
  @IsNotEmpty()
  @IsString()
  product: string;

  @IsNotEmpty()
  @IsString()
  user: string;
}
