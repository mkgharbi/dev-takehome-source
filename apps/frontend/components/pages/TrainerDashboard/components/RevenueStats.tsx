"use client";

import { formatEur } from "@repo/utils";
import { FC } from "react";

import { useTrainerRevenue } from "@/services/api/trainer/trainer";

type Props = {
  trainerId: string;
};

export const RevenueStats: FC<Props> = ({ trainerId }) => {
  const { data, isLoading } = useTrainerRevenue(trainerId);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="animate-pulse rounded-lg border border-black-100 bg-beige-50 p-5"
          >
            <div className="mb-3 h-3 w-24 rounded bg-black-200" />
            <div className="h-7 w-40 rounded bg-black-200" />
            <div className="mt-4 space-y-2">
              <div className="h-3 w-48 rounded bg-black-100" />
              <div className="h-3 w-36 rounded bg-black-100" />
              <div className="h-3 w-32 rounded bg-black-100" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!data) return null;

  const {
    confirmedRevenueCents,
    pendingRevenueCents,
    cancelledRevenueCents,
    totalRevenueCents,
    monthTotalRevenueCents,
    monthConfirmedRevenueCents,
    monthPendingRevenueCents,
    monthCancelledRevenueCents,
  } = data;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <RevenueCard
        label="Revenu total"
        total={totalRevenueCents}
        confirmed={confirmedRevenueCents}
        pending={pendingRevenueCents}
        cancelled={cancelledRevenueCents}
      />
      <RevenueCard
        label="Ce mois-ci"
        total={monthTotalRevenueCents}
        confirmed={monthConfirmedRevenueCents}
        pending={monthPendingRevenueCents}
        cancelled={monthCancelledRevenueCents ?? 0}
      />
    </div>
  );
};

type RevenueCardProps = {
  label: string;
  total: number;
  confirmed: number;
  pending: number;
  cancelled: number;
};

const RevenueCard: FC<RevenueCardProps> = ({
  label,
  total,
  confirmed,
  pending,
  cancelled,
}) => (
  <div className="rounded-lg border border-black-100 bg-beige-50 p-5">
    <p className="text-xs font-semibold uppercase tracking-wide text-black-500">
      {label}
    </p>

    {/* Total = confirmed + pending */}
    <p className="mt-1 text-2xl font-bold text-black-900">{formatEur(total)}</p>

    {/* Breakdown */}
    <div className="mt-4 space-y-1.5 border-t border-black-100 pt-3">
      <BreakdownRow
        label="Confirmé"
        amount={confirmed}
        color="text-green-700"
        prefix=""
      />
      <BreakdownRow
        label="En attente (inclus)"
        amount={pending}
        color="text-black-500"
        prefix="~"
      />
      {cancelled > 0 && (
        <BreakdownRow
          label="Annulé"
          amount={cancelled}
          color="text-red-600"
          prefix="−"
        />
      )}
    </div>
  </div>
);

type BreakdownRowProps = {
  label: string;
  amount: number;
  color: string;
  prefix: string;
};

const BreakdownRow: FC<BreakdownRowProps> = ({ label, amount, color, prefix }) => (
  <div className="flex items-center justify-between text-xs">
    <span className="text-black-500">{label}</span>
    <span className={`font-medium ${color}`}>
      {prefix}
      {formatEur(amount)}
    </span>
  </div>
);
