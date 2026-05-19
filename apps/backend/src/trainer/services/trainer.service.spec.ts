import { Test } from "@nestjs/testing";

import { TrainerService } from "./trainer.service";
import { TrainerRepository } from "../repositories/trainer.repository";

const SAMPLE = {
  id: "uuid-1",
  firstName: "Camille",
  lastName: "Dubois",
  email: "camille@example.fr",
  certifications: ["SST"],
  sessionCount: 4,
};

describe("TrainerService", () => {
  let service: TrainerService;
  let repository: { findAllWithSessionCount: jest.Mock };

  beforeEach(async () => {
    repository = {
      findAllWithSessionCount: jest.fn().mockResolvedValue([[SAMPLE], 1]),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        TrainerService,
        { provide: TrainerRepository, useValue: repository },
      ],
    }).compile();

    service = moduleRef.get(TrainerService);
  });

  it("returns trainers mapped to DTOs with pagination metadata", async () => {
    const result = await service.listTrainers(1, 20);

    expect(repository.findAllWithSessionCount).toHaveBeenCalledWith(1, 20);
    expect(result).toEqual({
      items: [SAMPLE],
      total: 1,
      page: 1,
      pageSize: 20,
    });
  });
});
