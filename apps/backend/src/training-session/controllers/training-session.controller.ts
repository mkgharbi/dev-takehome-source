import { Controller, Get, Query } from "@nestjs/common";
import { QueryTrainingSessionsDto } from "@repo/api";

import { TrainingSessionService } from "../services/training-session.service";

@Controller("training-sessions")
export class TrainingSessionController {
  constructor(
    private readonly trainingSessionService: TrainingSessionService,
  ) {}

  @Get()
  listTrainingSessions(@Query() query: QueryTrainingSessionsDto) {
    return this.trainingSessionService.listTrainingSessions(query);
  }
}
