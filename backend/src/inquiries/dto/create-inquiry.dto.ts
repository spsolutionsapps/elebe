import { IsString, IsEmail, IsOptional, IsArray, IsNumber } from 'class-validator';

export class CreateInquiryDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsArray()
  products?: Array<{
    name: string;
    quantity: number;
  }>;

  @IsOptional()
  @IsNumber()
  estimatedValue?: number;
}
