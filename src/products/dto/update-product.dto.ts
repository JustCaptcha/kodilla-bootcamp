import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Tags } from '../enums/tags.enum';

export class UpdateProductDTO {
  @IsString()
  @MinLength(3)
  @MaxLength(25)
  @IsNotEmpty()
  name: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  price: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  count: number;

  @IsEnum(Tags, { each: true })
  tags: Tags[];
}
