import { Test } from "@nestjs/testing";
import { DataSource } from "typeorm";

import { TrainerRepository } from "./trainer.repository";

describe("TrainerRepository", () => {
  describe("getRevenue", () => {
    let repository: TrainerRepository;
    let mockGetRawOne: jest.Mock;
    let mockAndWhere: jest.Mock;
    let mockWhere: jest.Mock;

    const trainerId = "trainer-uuid-123";

    beforeEach(async () => {
      mockGetRawOne = jest.fn();
      mockAndWhere = jest.fn().mockReturnThis();
      mockWhere = jest.fn().mockReturnThis();

      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        where: mockWhere,
        andWhere: mockAndWhere,
        getRawOne: mockGetRawOne,
      };

      const mockSessionRepo = {
        createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
      };

      // Both getRepository calls (TrainerEntity + TrainingSessionEntity)
      // return mockSessionRepo — fine here since we only test getRevenue.
      const mockDataSource = {
        getRepository: jest.fn().mockReturnValue(mockSessionRepo),
      };

      const moduleRef = await Test.createTestingModule({
        providers: [
          TrainerRepository,
          { provide: DataSource, useValue: mockDataSource },
        ],
      }).compile();

      repository = moduleRef.get(TrainerRepository);
    });

    it("runs 6 parallel SUM queries (one per status×scope combination)", async () => {
      mockGetRawOne.mockResolvedValue({ total: "0" });
      await repository.getRevenue(trainerId);
      expect(mockGetRawOne).toHaveBeenCalledTimes(6);
    });

    it("computes totalRevenueCents as confirmed + pending (excludes cancelled)", async () => {
      // confirmed=5000, pending=3000, cancelled=2000
      // month-confirmed=1000, month-pending=500, month-cancelled=200
      mockGetRawOne
        .mockResolvedValueOnce({ total: "5000" }) // confirmed
        .mockResolvedValueOnce({ total: "3000" }) // pending
        .mockResolvedValueOnce({ total: "2000" }) // cancelled
        .mockResolvedValueOnce({ total: "1000" }) // month confirmed
        .mockResolvedValueOnce({ total: "500" })  // month pending
        .mockResolvedValueOnce({ total: "200" }); // month cancelled

      const result = await repository.getRevenue(trainerId);

      expect(result.totalRevenueCents).toBe(8000); // 5000 + 3000
      expect(result.cancelledRevenueCents).toBe(2000); // tracked separately
    });

    it("computes monthTotalRevenueCents as month-confirmed + month-pending (excludes month-cancelled)", async () => {
      mockGetRawOne
        .mockResolvedValueOnce({ total: "5000" })
        .mockResolvedValueOnce({ total: "3000" })
        .mockResolvedValueOnce({ total: "2000" })
        .mockResolvedValueOnce({ total: "1000" }) // month confirmed
        .mockResolvedValueOnce({ total: "500" })  // month pending
        .mockResolvedValueOnce({ total: "200" }); // month cancelled

      const result = await repository.getRevenue(trainerId);

      expect(result.monthTotalRevenueCents).toBe(1500); // 1000 + 500
      expect(result.monthCancelledRevenueCents).toBe(200); // tracked separately
    });

    it("returns all eight revenue fields", async () => {
      mockGetRawOne
        .mockResolvedValueOnce({ total: "5000" })
        .mockResolvedValueOnce({ total: "3000" })
        .mockResolvedValueOnce({ total: "2000" })
        .mockResolvedValueOnce({ total: "1000" })
        .mockResolvedValueOnce({ total: "500" })
        .mockResolvedValueOnce({ total: "200" });

      const result = await repository.getRevenue(trainerId);

      expect(result).toEqual({
        confirmedRevenueCents: 5000,
        pendingRevenueCents: 3000,
        cancelledRevenueCents: 2000,
        totalRevenueCents: 8000,
        monthConfirmedRevenueCents: 1000,
        monthPendingRevenueCents: 500,
        monthCancelledRevenueCents: 200,
        monthTotalRevenueCents: 1500,
      });
    });

    it("defaults to 0 when the SUM returns null (no sessions)", async () => {
      mockGetRawOne.mockResolvedValue({ total: null });

      const result = await repository.getRevenue(trainerId);

      expect(result.totalRevenueCents).toBe(0);
      expect(result.monthTotalRevenueCents).toBe(0);
    });

    it("adds strftime month filter only to the three month-scoped queries", async () => {
      mockGetRawOne.mockResolvedValue({ total: "0" });
      await repository.getRevenue(trainerId);

      const allCalls: string[][] = mockAndWhere.mock.calls.map(
        (call) => [call[0] as string],
      );
      const monthCalls = allCalls.filter(([clause]) =>
        clause.includes("strftime"),
      );

      expect(monthCalls).toHaveLength(3);
    });

    it("filters each query by trainerId", async () => {
      mockGetRawOne.mockResolvedValue({ total: "0" });
      await repository.getRevenue(trainerId);

      mockWhere.mock.calls.forEach((call) => {
        expect(call[0] as string).toContain("trainerId");
      });
    });

    it("queries confirmed status for the all-time confirmed bucket", async () => {
      mockGetRawOne.mockResolvedValue({ total: "0" });
      await repository.getRevenue(trainerId);

      const statusCalls = mockAndWhere.mock.calls
        .filter((call) =>
          (call[0] as string).includes("session.status IN"),
        )
        .map((call) => call[1]);

      expect(statusCalls.some((p) => p.statuses.includes("confirmed"))).toBe(true);
      expect(statusCalls.some((p) => p.statuses.includes("pending"))).toBe(true);
      expect(statusCalls.some((p) => p.statuses.includes("cancelled"))).toBe(true);
    });
  });
});
