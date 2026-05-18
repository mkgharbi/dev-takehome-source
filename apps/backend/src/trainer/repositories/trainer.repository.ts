import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

import { BaseRepository } from "../../utils/helpers/base-repository";
import { TrainerEntity } from "../entities/trainer.entity";
import { BaseTrainer, TrainerForList } from "../types/trainer.repository.types";

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
}
