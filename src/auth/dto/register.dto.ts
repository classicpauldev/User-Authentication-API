import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';
import { PASSWORD_MIN_MESSAGE, PASSWORD_MAX_MESSAGE, MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH } from '../../common/constants';
import { Transform } from 'class-transformer';

/** DTO for user registration. */
export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(MIN_PASSWORD_LENGTH, { message: PASSWORD_MIN_MESSAGE })
  @MaxLength(MAX_PASSWORD_LENGTH, { message: PASSWORD_MAX_MESSAGE })
  password: string;
}
