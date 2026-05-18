import { Controller, Get, Query } from "@nestjs/common";
import { PaginationDto } from "@repo/api";

import { TrainerService } from "../services/trainer.service";

@Controller("trainers")
export class TrainerController {
  constructor(private readonly trainerService: TrainerService) {}

  @Get()
  listTrainers(@Query() query: PaginationDto) {
    return this.trainerService.listTrainers(query.page ?? 1, query.pageSize ?? 20);
  }
}
