import { IsNotEmpty, IsString } from 'class-validator';

export class CommentRemoveMarketDto {
  @IsNotEmpty()
  @IsString()
  product: string;

  @IsNotEmpty()
  @IsString()
  author: string;
}
