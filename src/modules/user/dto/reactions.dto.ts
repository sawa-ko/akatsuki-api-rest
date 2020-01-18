import { IsString, IsNotEmpty } from 'class-validator';

export class ReactionsDto {
  @IsString()
  @IsNotEmpty()
  readonly toId: string;

  @IsString()
  @IsNotEmpty()
  readonly ofId: string;

  @IsString()
  @IsNotEmpty()
  readonly type: string;
}
