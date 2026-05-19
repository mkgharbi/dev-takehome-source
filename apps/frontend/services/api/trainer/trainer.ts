import type { PageDto, TrainerDto } from "@repo/api";
import { ApiRoutes } from "@repo/api/constants";
import useSWR from "swr";

import { apiFetcher } from "@/lib/api-client";

type TrainerRevenue = {
  confirmedRevenueCents: number;
  pendingRevenueCents: number;
  cancelledRevenueCents: number;
  totalRevenueCents: number;
  monthTotalRevenueCents: number;
  monthConfirmedRevenueCents: number;
  monthPendingRevenueCents: number;
  monthCancelledRevenueCents: number;
};

export const useTrainers = () =>
  useSWR<PageDto<TrainerDto>>(ApiRoutes.trainers, apiFetcher);

export const useTrainer = (trainerId: string) =>
  useSWR<TrainerDto>(
    trainerId ? `${ApiRoutes.trainers}/${trainerId}` : null,
    apiFetcher,
  );

export const useTrainerRevenue = (trainerId: string) =>
  useSWR<TrainerRevenue>(
    trainerId ? `${ApiRoutes.trainers}/${trainerId}/revenue` : null,
    apiFetcher,
  );
