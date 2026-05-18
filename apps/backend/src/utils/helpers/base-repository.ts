import { Injectable } from "@nestjs/common";
import { DataSource, type ObjectLiteral, Repository } from "typeorm";

/**
 * Tiny BaseRepository — exposes a typed `repository` accessor over a DataSource.
 * Custom repositories extend it and never use `@InjectRepository` directly.
 *
 * Mirrors the prod pattern minus the transaction / CLS plumbing.
 */
@Injectable()
export abstract class BaseRepository<T extends ObjectLiteral> {
  protected readonly repository: Repository<T>;

  constructor(
    protected readonly entityClass: new () => T,
    readonly dataSource: DataSource,
  ) {
    this.repository = dataSource.getRepository(entityClass);
  }
}
