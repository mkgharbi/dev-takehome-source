import { Injectable } from "@nestjs/common";
import type {
  PageDto,
  QueryTrainingSessionsDto,
  TrainingSessionDto,
} from "@repo/api";

import { mapTrainingSessionToDto } from "../mappers/training-session.mapper";
import { TrainingSessionRepository } from "../repositories/training-session.repository";

@Injectable()
export class TrainingSessionService {
  constructor(
    private readonly trainingSessionRepository: TrainingSessionRepository,
  ) {}

  async listTrainingSessions(
    query: QueryTrainingSessionsDto,
  ): Promise<PageDto<TrainingSessionDto>> {
    const [sessions, total] =
      await this.trainingSessionRepository.findAllWithBookingCount(query);
    return {
      items: sessions.map(mapTrainingSessionToDto),
      total,
      page: query.page ?? 1,
      pageSize: query.pageSize ?? 20,
    };
  }
}
