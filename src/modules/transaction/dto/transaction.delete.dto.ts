import { IsNotEmpty, IsString } from 'class-validator';

export class TransactionDeleteDto {
  @IsNotEmpty()
  @IsString()
  public buyer: string;

  @IsNotEmpty()
  @IsString()
  public seller: string;

  @IsNotEmpty()
  @IsString()
  public product: string;
}
