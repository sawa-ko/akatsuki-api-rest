import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class SecurityDto {
  @IsString()
  @IsNotEmpty()
  readonly id: string;

  @IsNumber()
  @IsNotEmpty()
  readonly code1: number;

  @IsNumber()
  @IsNotEmpty()
  readonly code2: number;

  @IsNumber()
  @IsNotEmpty()
  readonly code3: number;

  @IsNumber()
  @IsNotEmpty()
  readonly code4: number;

  @IsNumber()
  @IsNotEmpty()
  readonly code5: number;
}
