import { Module } from "@nestjs/common";

import { TrainingSessionController } from "./controllers/training-session.controller";
import { TrainingSessionRepository } from "./repositories/training-session.repository";
import { TrainingSessionService } from "./services/training-session.service";

@Module({
  controllers: [TrainingSessionController],
  providers: [TrainingSessionService, TrainingSessionRepository],
  exports: [TrainingSessionRepository],
})
export class TrainingSessionModule {}
