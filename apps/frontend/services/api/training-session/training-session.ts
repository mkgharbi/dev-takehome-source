
import type { PageDto, TrainingSessionDto } from "@repo/api";
import { ApiRoutes } from "@repo/api/constants";
import useSWR, { mutate } from "swr";

import { apiFetcher } from "@/lib/api-client";

export const useTrainingSessions = (params?: { trainerId?: string }) => {
  const search = params?.trainerId
    ? `?trainerId=${encodeURIComponent(params.trainerId)}`
    : "";
  return useSWR<PageDto<TrainingSessionDto>>(
    `${ApiRoutes.trainingSessions}${search}`,
    apiFetcher,
  );
};

export const mutateTrainingSessions = () =>
  mutate(
    (key) =>
      typeof key === "string" && key.startsWith(ApiRoutes.trainingSessions),
  );
