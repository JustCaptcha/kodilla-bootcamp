import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { Roles } from 'src/shared/enums/roles.enum';
import { arrayToDate } from 'src/shared/helpers/date.helper';

export class UpdateUserDTO {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Transform((d) => arrayToDate(d))
  dateOfBirth: Date;

  @ValidateNested({ each: true })
  @Type(() => UpdateUserAddressDTO)
  address: Array<UpdateUserAddressDTO>;

  @IsEnum(Roles)
  role: Roles;
}

export class UpdateUserAddressDTO {
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
