import { Injectable } from "@nestjs/common";
import type { QueryTrainingSessionsDto } from "@repo/api";
import { DataSource } from "typeorm";

import { BaseRepository } from "../../utils/helpers/base-repository";
import { TrainingSessionEntity } from "../entities/training-session.entity";
import {
  BaseTrainingSession,
  TrainingSessionForList,
} from "../types/training-session.repository.types";

@Injectable()
export class TrainingSessionRepository extends BaseRepository<TrainingSessionEntity> {
  constructor(dataSource: DataSource) {
    super(TrainingSessionEntity, dataSource);
  }

  async findAllWithBookingCount(
    query: QueryTrainingSessionsDto,
  ): Promise<[TrainingSessionForList[], number]> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;

    const qb = this.repository
      .createQueryBuilder("session")
      .innerJoinAndSelect("session.trainer", "trainer")
      .loadRelationCountAndMap("session.bookingCount", "session.bookings")
      .orderBy("session.startsAt", "ASC")
      .skip((page - 1) * pageSize)
      .take(pageSize);

    if (query.trainerId) {
      qb.andWhere("session.trainerId = :trainerId", {
        trainerId: query.trainerId,
      });
    }
    if (query.status) {
      const statuses = query.status.split(",").filter((s) => s.trim());
      if (statuses.length > 0) {
        qb.andWhere("session.status IN (:...statuses)", { statuses });
      }
    }
    if (query.from) {
      qb.andWhere("session.startsAt >= :from", { from: query.from });
    }
    if (query.to) {
      qb.andWhere("session.startsAt <= :to", { to: query.to });
    }

    const [rows, total] = await qb.getManyAndCount();
    return [rows as unknown as TrainingSessionForList[], total];
  }

  findByIdOrFail(id: string): Promise<BaseTrainingSession> {
    return this.repository.findOneOrFail({
      where: { id },
      select: [
        "id",
        "title",
        "sector",
        "status",
        "startsAt",
        "endsAt",
        "location",
        "priceCents",
        "capacity",
        "trainerId",
      ],
    });
  }
}
