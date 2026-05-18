import { Type } from "class-transformer";
import { IsDateString, IsEnum, IsOptional, IsString } from "class-validator";

import { TrainingSessionStatus } from "./training-session.types";
import { PaginationDto } from "../common/pagination.dto";

export class QueryTrainingSessionsDto extends PaginationDto {
  @IsOptional()
  @IsString()
  trainerId?: string;

  @IsOptional()
  @IsEnum(TrainingSessionStatus)
  status?: TrainingSessionStatus;

  @IsOptional()
  @IsDateString()
  @Type(() => String)
  from?: string;

  @IsOptional()
  @IsDateString()
  @Type(() => String)
  to?: string;
}
