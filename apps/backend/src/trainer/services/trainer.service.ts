import { Injectable } from "@nestjs/common";
import type { PageDto, TrainerDto } from "@repo/api";

import { mapTrainerToDto } from "../mappers/trainer.mapper";
import { TrainerRepository } from "../repositories/trainer.repository";

@Injectable()
export class TrainerService {
  constructor(private readonly trainerRepository: TrainerRepository) {}

  async listTrainers(
    page: number,
    pageSize: number,
  ): Promise<PageDto<TrainerDto>> {
    const [trainers, total] =
      await this.trainerRepository.findAllWithSessionCount(page, pageSize);
    return {
      items: trainers.map(mapTrainerToDto),
      total,
      page,
      pageSize,
    };
  }
}
