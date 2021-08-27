import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Roles } from 'src/shared/enums/roles.enum';
import { Transform, Type } from 'class-transformer';
import { arrayToDate } from 'src/shared/helpers/date.helper';

export class CreateUserDTO {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Transform((d) => arrayToDate(d.value))
  dateOfBirth: Date;

  @ValidateNested({ each: true })
  @Type(() => CreateUserAddressDTO)
  address?: Array<CreateUserAddressDTO>;

  @IsEnum(Roles)
  role: Roles;
}

export class CreateUserAddressDTO {
  @IsNotEmpty()
  country: string;

  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  street: string;

  @IsNumber()
  @IsNotEmpty()
  number: number;
}
