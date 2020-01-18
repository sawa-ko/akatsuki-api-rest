import { IsString, IsNotEmpty } from 'class-validator';

export class ReactionsDto {
  @IsString()
  @IsNotEmpty()
  readonly to: string;

  @IsString()
  @IsNotEmpty()
  readonly id: string;

  @IsString()
  @IsNotEmpty()
  readonly type: string;
}
