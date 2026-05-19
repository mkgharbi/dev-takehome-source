
import type { PageDto, TrainingSessionDto } from "@repo/api";
import { ApiRoutes } from "@repo/api/constants";
import useSWR, { mutate } from "swr";

import { apiFetcher } from "@/lib/api-client";

export interface TrainingSessionsParams {
  trainerId?: string;
  status?: string;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
}

export const useTrainingSessions = (params?: TrainingSessionsParams) => {
  const buildSearch = (p?: TrainingSessionsParams) => {
    if (!p) return "";
    const searchParams = new URLSearchParams();
    if (p.trainerId) searchParams.append("trainerId", p.trainerId);
    if (p.status) searchParams.append("status", p.status);
    if (p.from) searchParams.append("from", p.from);
    if (p.to) searchParams.append("to", p.to);
    if (p.page) searchParams.append("page", p.page.toString());
    if (p.pageSize) searchParams.append("pageSize", p.pageSize.toString());
    const search = searchParams.toString();
    return search ? `?${search}` : "";
  };

  const search = buildSearch(params);
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
