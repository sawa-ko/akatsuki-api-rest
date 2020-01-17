import { IsNumber, IsString } from 'class-validator';

export class SecurityDto {
  @IsString()
  readonly id: string;

  @IsNumber()
  readonly code1: number;

  @IsNumber()
  readonly code2: number;

  @IsNumber()
  readonly code3: number;

  @IsNumber()
  readonly code4: number;

  @IsNumber()
  readonly code5: number;
}
