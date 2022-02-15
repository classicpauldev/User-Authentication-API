import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';
import { PASSWORD_MIN_MESSAGE, PASSWORD_MAX_MESSAGE } from '../../common/constants';
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
  @MinLength(6, { message: PASSWORD_MIN_MESSAGE })
  @MaxLength(72, { message: PASSWORD_MAX_MESSAGE })
  password: string;
}
