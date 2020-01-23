import { IsNotEmpty, IsString } from 'class-validator';

export class BuyerRemoveMarketDto {
  @IsNotEmpty()
  @IsString()
  public product: string;

  @IsNotEmpty()
  @IsString()
  public user: string;
}
