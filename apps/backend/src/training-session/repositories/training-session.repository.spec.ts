import { Test } from "@nestjs/testing";
import { DataSource } from "typeorm";

import { TrainingSessionRepository } from "./training-session.repository";

describe("TrainingSessionRepository", () => {
  let repository: TrainingSessionRepository;
  let mockRepository: any;
  let mockQueryBuilder: any;

  beforeEach(async () => {
    mockQueryBuilder = {
      createQueryBuilder: jest.fn().mockReturnThis(),
      innerJoinAndSelect: jest.fn().mockReturnThis(),
      loadRelationCountAndMap: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
    };

    mockRepository = {
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
      findOneOrFail: jest.fn(),
    };

    const mockDataSource = {
      getRepository: jest.fn().mockReturnValue(mockRepository),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        TrainingSessionRepository,
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    repository = moduleRef.get(TrainingSessionRepository);
  });

  describe("findAllWithBookingCount", () => {
    it("should filter by single status using IN clause", async () => {
      await repository.findAllWithBookingCount({
        page: 1,
        pageSize: 10,
        status: "pending",
      });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        "session.status IN (:...statuses)",
        { statuses: ["pending"] }
      );
    });

    it("should filter by multiple statuses using OR logic (IN clause)", async () => {
      await repository.findAllWithBookingCount({
        page: 1,
        pageSize: 10,
        status: "pending,confirmed",
      });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        "session.status IN (:...statuses)",
        { statuses: ["pending", "confirmed"] }
      );
    });

    it("should handle three statuses with OR logic", async () => {
      await repository.findAllWithBookingCount({
        page: 1,
        pageSize: 10,
        status: "pending,confirmed,cancelled",
      });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        "session.status IN (:...statuses)",
        { statuses: ["pending", "confirmed", "cancelled"] }
      );
    });

    it("should not add status filter when status is not provided", async () => {
      await repository.findAllWithBookingCount({
        page: 1,
        pageSize: 10,
      });

      const calls = mockQueryBuilder.andWhere.mock.calls;
      const statusCalls = calls.filter((call: any) =>
        call[0].includes("session.status")
      );

      expect(statusCalls).toHaveLength(0);
    });

    it("should apply trainer filter", async () => {
      await repository.findAllWithBookingCount({
        page: 1,
        pageSize: 10,
        trainerId: "trainer-uuid",
      });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        "session.trainerId = :trainerId",
        { trainerId: "trainer-uuid" }
      );
    });

    it("should apply date range filters", async () => {
      const from = "2025-01-01";
      const to = "2025-12-31";

      await repository.findAllWithBookingCount({
        page: 1,
        pageSize: 10,
        from,
        to,
      });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        "session.startsAt >= :from",
        { from }
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        "session.startsAt <= :to",
        { to }
      );
    });

    it("should combine status, trainer, and date filters", async () => {
      await repository.findAllWithBookingCount({
        page: 1,
        pageSize: 10,
        trainerId: "trainer-uuid",
        status: "pending,confirmed",
        from: "2025-01-01",
        to: "2025-12-31",
      });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        "session.trainerId = :trainerId",
        { trainerId: "trainer-uuid" }
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        "session.status IN (:...statuses)",
        { statuses: ["pending", "confirmed"] }
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        "session.startsAt >= :from",
        { from: "2025-01-01" }
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        "session.startsAt <= :to",
        { to: "2025-12-31" }
      );
    });

    it("should apply pagination correctly", async () => {
      await repository.findAllWithBookingCount({
        page: 2,
        pageSize: 20,
      });

      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(20);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(20);
    });

    it("should ignore empty status values after split", async () => {
      await repository.findAllWithBookingCount({
        page: 1,
        pageSize: 10,
        status: "pending,,",
      });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        "session.status IN (:...statuses)",
        { statuses: ["pending"] }
      );
    });

    it("should not apply status filter if all values are empty after split", async () => {
      mockQueryBuilder.andWhere.mockClear();

      await repository.findAllWithBookingCount({
        page: 1,
        pageSize: 10,
        status: ",,",
      });

      const calls = mockQueryBuilder.andWhere.mock.calls;
      const statusCalls = calls.filter((call: any) =>
        call[0].includes("session.status")
      );

      expect(statusCalls).toHaveLength(0);
    });
  });
});
