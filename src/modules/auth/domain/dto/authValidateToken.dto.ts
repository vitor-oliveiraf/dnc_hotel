import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export interface JwtPayload {
  name: string;
  sub: string;
}

export class ValidateTokenDTO {
  @IsBoolean()
  @IsNotEmpty()
  valid: boolean;

  @IsOptional()
  @ValidateNested()
  decoded?: JwtPayload;

  @IsString()
  @IsOptional()
  message?: string;
}
