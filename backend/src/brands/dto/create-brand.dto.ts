import { IsString, IsOptional, IsBoolean, IsUrl, IsNumber } from 'class-validator'
import { Transform } from 'class-transformer'

export class CreateBrandDto {
  @IsString()
  name: string

  @IsOptional()
  @IsString()
  logo?: string

  @IsOptional()
  @Transform(({ value }) => {
    if (value === '' || value === null || value === undefined) {
      return undefined
    }
    return value
  })
  @IsUrl()
  website?: string

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value === 'true'
    }
    return value
  })
  @IsBoolean()
  isActive?: boolean

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return parseInt(value, 10)
    }
    return value
  })
  @IsNumber()
  order?: number
}
