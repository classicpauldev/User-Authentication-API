import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

/** DTO for user login. */
export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
