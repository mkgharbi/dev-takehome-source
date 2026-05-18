
import type { PageDto, TrainerDto } from "@repo/api";
import { ApiRoutes } from "@repo/api/constants";
import useSWR from "swr";

import { apiFetcher } from "@/lib/api-client";

export const useTrainers = () =>
  useSWR<PageDto<TrainerDto>>(ApiRoutes.trainers, apiFetcher);
