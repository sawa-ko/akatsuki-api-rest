import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
export class SignInDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;

  @IsNotEmpty()
  public device: string | number;

  @IsNotEmpty()
  @IsString()
  public ip: string;
}
