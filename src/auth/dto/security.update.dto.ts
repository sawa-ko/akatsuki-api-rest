import { IsString, IsNotEmpty, IsNumber, IsBoolean } from 'class-validator';

export class SecurityCode {
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

  @IsBoolean()
  @IsNotEmpty()
  readonly enabled: string;
}

export class SecurityUpdateDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  security: SecurityCode;
}
