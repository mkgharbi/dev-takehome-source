import { Module } from "@nestjs/common";

import { TrainerController } from "./controllers/trainer.controller";
import { TrainerRepository } from "./repositories/trainer.repository";
import { TrainerService } from "./services/trainer.service";

@Module({
  controllers: [TrainerController],
  providers: [TrainerService, TrainerRepository],
  exports: [TrainerService],
})
export class TrainerModule {}
