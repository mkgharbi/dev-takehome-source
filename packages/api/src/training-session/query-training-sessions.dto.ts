import { Type } from "class-transformer";
import { IsDateString, IsOptional, IsString } from "class-validator";

import { PaginationDto } from "../common/pagination.dto";

export class QueryTrainingSessionsDto extends PaginationDto {
  @IsOptional()
  @IsString()
  trainerId?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsDateString()
  @Type(() => String)
  from?: string;

  @IsOptional()
  @IsDateString()
  @Type(() => String)
  to?: string;
}
