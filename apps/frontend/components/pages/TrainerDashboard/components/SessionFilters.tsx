"use client";

import { Button } from "@repo/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { FC, useState } from "react";

type Props = {
  onApplyFilters?: (filters: FilterValues) => void;
};

export type FilterValues = {
  status: string[];
  from: string;
  to: string;
};

const statusLabels: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  cancelled: "Annulée",
};

export const SessionFilters: FC<Props> = ({ onApplyFilters }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const statusParam = searchParams.get("status") || "";
  const [statuses, setStatuses] = useState<string[]>(
    statusParam ? statusParam.split(",") : []
  );
  const [from, setFrom] = useState(searchParams.get("from") || "");
  const [to, setTo] = useState(searchParams.get("to") || "");

  const isDateRangeInvalid = from && to && new Date(to) < new Date(from);
  const hasActiveFilters = statuses.length > 0 || from || to;

  const updateFilters = (newStatuses: string[], newFrom: string, newTo: string) => {
    const filterValues = { status: newStatuses, from: newFrom, to: newTo };

    if (onApplyFilters) {
      onApplyFilters(filterValues);
    } else {
      const params = new URLSearchParams(searchParams);

      if (newStatuses.length > 0) {
        params.set("status", newStatuses.join(","));
      } else {
        params.delete("status");
      }

      if (newFrom) {
        params.set("from", newFrom);
      } else {
        params.delete("from");
      }

      if (newTo) {
        params.set("to", newTo);
      } else {
        params.delete("to");
      }

      params.set("page", "1");
      router.push(`?${params.toString()}`);
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setStatuses(selectedOptions);
    updateFilters(selectedOptions, from, to);
  };

  const handleFromChange = (newFrom: string) => {
    setFrom(newFrom);
    updateFilters(statuses, newFrom, to);
  };

  const handleToChange = (newTo: string) => {
    setTo(newTo);
    updateFilters(statuses, from, newTo);
  };

  const handleClearFilters = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("status");
    params.delete("from");
    params.delete("to");
    params.set("page", "1");

    setStatuses([]);
    setFrom("");
    setTo("");

    if (onApplyFilters) {
      onApplyFilters({ status: [], from: "", to: "" });
    } else {
      router.push(`?${params.toString()}`);
    }
  };

  return (
    <div className="rounded-lg border border-black-100 bg-beige-50 p-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-black-600">
            Statut
          </label>
          <select
            multiple
            value={statuses}
            onChange={handleStatusChange}
            className="mt-2 block w-full cursor-pointer rounded-lg border border-black-200 bg-white px-3 py-2 text-sm text-black-900 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-200"
          >
            <option value="pending">En attente</option>
            <option value="confirmed">Confirmée</option>
            <option value="cancelled">Annulée</option>
          </select>
          {statuses.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {statuses.map((status) => (
                <span
                  key={status}
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                    status === "pending"
                      ? "bg-blue-100 text-blue-700"
                      : status === "confirmed"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  {statusLabels[status]}
                </span>
              ))}
            </div>
          )}
          <p className="mt-2 text-xs text-black-500">Ctrl/Cmd + Click pour sélectionner plusieurs</p>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-black-600">
            À partir du
          </label>
          <input
            type="date"
            value={from}
            onChange={(e) => handleFromChange(e.target.value)}
            className={`mt-2 block w-full cursor-pointer rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 transition-colors ${
              isDateRangeInvalid
                ? "border-red-300 bg-red-50 text-black-900 focus:border-red-500 focus:ring-red-200"
                : "border-black-200 bg-white text-black-900 focus:border-orange-500 focus:ring-orange-200"
            }`}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-black-600">
            Jusqu&apos;au
          </label>
          <input
            type="date"
            value={to}
            onChange={(e) => handleToChange(e.target.value)}
            className={`mt-2 block w-full cursor-pointer rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 transition-colors ${
              isDateRangeInvalid
                ? "border-red-300 bg-red-50 text-black-900 focus:border-red-500 focus:ring-red-200"
                : "border-black-200 bg-white text-black-900 focus:border-orange-500 focus:ring-orange-200"
            }`}
          />
        </div>
      </div>

      {isDateRangeInvalid && (
        <div className="mt-3 rounded-lg bg-red-50 border border-red-200 p-3">
          <p className="text-xs font-medium text-red-800">
            ⚠️ La date de fin doit être après la date de début
          </p>
        </div>
      )}

      {hasActiveFilters && (
        <div className="mt-4">
          <Button
            onClick={handleClearFilters}
            className="cursor-pointer rounded-lg border border-black-200 bg-white px-4 py-2 text-sm font-medium text-black-900 hover:bg-black-50 transition-colors"
          >
            Réinitialiser les filtres
          </Button>
        </div>
      )}
    </div>
  );
};
