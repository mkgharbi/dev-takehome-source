import { Injectable } from "@nestjs/common";
import { TrainingSessionStatus } from "@repo/api/constants";
import { DataSource } from "typeorm";

import { TrainingSessionEntity } from "../../training-session/entities/training-session.entity";
import { BaseRepository } from "../../utils/helpers/base-repository";
import { TrainerEntity } from "../entities/trainer.entity";
import {
    BaseTrainer,
    TrainerForList,
    TrainerRevenue,
} from "../types/trainer.repository.types";

@Injectable()
export class TrainerRepository extends BaseRepository<TrainerEntity> {
  constructor(dataSource: DataSource) {
    super(TrainerEntity, dataSource);
  }

  async findAllWithSessionCount(
    page: number,
    pageSize: number,
  ): Promise<[TrainerForList[], number]> {
    const [rows, total] = await this.repository
      .createQueryBuilder("trainer")
      .loadRelationCountAndMap("trainer.sessionCount", "trainer.sessions")
      .orderBy("trainer.lastName", "ASC")
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return [rows as unknown as TrainerForList[], total];
  }

  findByIdOrFail(id: string): Promise<BaseTrainer> {
    return this.repository.findOneOrFail({
      where: { id },
      select: ["id", "firstName", "lastName", "email", "certifications"],
    });
  }

  async findByIdWithSessionCount(id: string): Promise<TrainerForList> {
    const trainer = await this.repository
      .createQueryBuilder("trainer")
      .where("trainer.id = :id", { id })
      .loadRelationCountAndMap("trainer.sessionCount", "trainer.sessions")
      .getOneOrFail();

    return trainer as unknown as TrainerForList;
  }

  async getRevenue(trainerId: string): Promise<TrainerRevenue> {
    const sessionRepo = this.dataSource.getRepository(TrainingSessionEntity);

    const sumByStatus = async (
      statuses: TrainingSessionStatus[],
      monthOnly: boolean,
    ): Promise<number> => {
      const qb = sessionRepo
        .createQueryBuilder("session")
        .select("COALESCE(SUM(session.priceCents), 0)", "total")
        .where("session.trainerId = :trainerId", { trainerId })
        .andWhere("session.status IN (:...statuses)", { statuses });

      if (monthOnly) {
        qb.andWhere(
          "strftime('%Y-%m', session.startsAt) = strftime('%Y-%m', 'now')",
        );
      }

      const row = await qb.getRawOne<{ total: string }>();
      return parseInt(row?.total ?? "0", 10);
    };

    const confirmed = TrainingSessionStatus.Confirmed;
    const pending = TrainingSessionStatus.Pending;
    const cancelled = TrainingSessionStatus.Cancelled;

    const [
      confirmedRevenueCents,
      pendingRevenueCents,
      cancelledRevenueCents,
      monthConfirmedRevenueCents,
      monthPendingRevenueCents,
      monthCancelledRevenueCents,
    ] = await Promise.all([
      sumByStatus([confirmed], false),
      sumByStatus([pending], false),
      sumByStatus([cancelled], false),
      sumByStatus([confirmed], true),
      sumByStatus([pending], true),
      sumByStatus([cancelled], true),
    ]);

    return {
      confirmedRevenueCents,
      pendingRevenueCents,
      cancelledRevenueCents,
      totalRevenueCents: confirmedRevenueCents + pendingRevenueCents,
      monthTotalRevenueCents: monthConfirmedRevenueCents + monthPendingRevenueCents,
      monthConfirmedRevenueCents,
      monthPendingRevenueCents,
      monthCancelledRevenueCents,
    };
  }
}
