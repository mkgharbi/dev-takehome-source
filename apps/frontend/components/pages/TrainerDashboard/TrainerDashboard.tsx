"use client";

import { useSearchParams } from "next/navigation";
import { FC } from "react";

import { PaginationControls } from "./components/PaginationControls";
import { RevenueStats } from "./components/RevenueStats";
import { SessionFilters } from "./components/SessionFilters";
import { SessionsTable } from "./components/SessionsTable";
import { TableSkeleton } from "./components/TableSkeleton";

import { useTrainer } from "@/services/api/trainer/trainer";
import { useTrainingSessions } from "@/services/api/training-session/training-session";

type Props = {
  trainerId: string;
};

export const TrainerDashboard: FC<Props> = ({ trainerId }) => {
  const searchParams = useSearchParams();

  const status = searchParams.get("status") || "";
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
  const page = parseInt(searchParams.get("page") || "1", 10);

  const { data: trainer, isLoading: trainerLoading, error: trainerError } =
    useTrainer(trainerId);
  const { data: sessionsData, isLoading: sessionsLoading, error: sessionsError } =
    useTrainingSessions({
      trainerId,
      status: status || undefined,
      from: from || undefined,
      to: to || undefined,
      page,
      pageSize,
    });

  // Trainer not found error
  if (trainerError) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="rounded-xl border border-red-300 bg-red-50 p-8">
          <h2 className="text-lg font-semibold text-red-900">Erreur</h2>
          <p className="mt-2 text-sm text-red-700">
            Impossible de charger le formateur. Veuillez vérifier l&apos;ID et
            réessayer.
          </p>
        </div>
      </main>
    );
  }

  // Loading state
  if (trainerLoading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="space-y-8">
          <div>
            <div className="h-8 w-64 animate-pulse rounded-lg bg-black-200" />
            <div className="mt-2 h-5 w-40 animate-pulse rounded-lg bg-black-100" />
          </div>
          <div className="h-40 animate-pulse rounded-lg bg-beige-50" />
          <TableSkeleton />
        </div>
      </main>
    );
  }

  // Trainer not found (no error, but no data)
  if (!trainer) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="rounded-xl border border-black-200 bg-beige-50 p-8">
          <h2 className="text-lg font-semibold text-black-800">
            Formateur non trouvé
          </h2>
          <p className="mt-2 text-sm text-black-400">
            Le formateur demandé n&apos;existe pas.
          </p>
        </div>
      </main>
    );
  }

  const sessions = sessionsData?.items ?? [];
  const total = sessionsData?.total ?? 0;
  const totalPages = Math.ceil(total / pageSize);

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="space-y-8">
        {/* Trainer Header */}
        <div className="border-b border-black-100 pb-8">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-black-900">
                {trainer.firstName} {trainer.lastName}
              </h1>
              <p className="mt-1 text-sm text-black-500">Tableau de bord des sessions</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-semibold text-orange-500">{total}</p>
              <p className="text-xs text-black-500 uppercase tracking-wide">Sessions</p>
            </div>
          </div>
        </div>

        {/* Revenue Stats — independent of filter state */}
        <div>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-black-600">
            Revenus
          </h2>
          <RevenueStats trainerId={trainerId} />
        </div>

        {/* Filters Section */}
        <div>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-black-600">
            Filtrer
          </h2>
          <SessionFilters />
        </div>

        {/* Content Section */}
        <div className="space-y-6">
          {sessionsError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6">
              <p className="text-sm font-medium text-red-900">
                Erreur lors du chargement des sessions
              </p>
              <p className="mt-1 text-sm text-red-700">
                Veuillez réessayer ou contactez le support.
              </p>
            </div>
          ) : sessionsLoading ? (
            <TableSkeleton />
          ) : sessions.length === 0 ? (
            <div className="rounded-xl border border-dashed border-black-200 bg-beige-50 p-12 text-center">
              <p className="text-sm font-medium text-black-700">Aucune session trouvée</p>
              <p className="mt-1 text-xs text-black-500">
                Essayez d&apos;ajuster les filtres ou créer une nouvelle session.
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-lg border border-black-100 bg-white overflow-hidden">
                <SessionsTable sessions={sessions} />
              </div>

              <PaginationControls
                page={page}
                pageSize={pageSize}
                totalPages={totalPages}
                total={total}
              />
            </>
          )}
        </div>
      </div>
    </main>
  );
};
