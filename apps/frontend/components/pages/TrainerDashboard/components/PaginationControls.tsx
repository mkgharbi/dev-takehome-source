"use client";

import { Button } from "@repo/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { FC } from "react";

type Props = {
  page: number;
  pageSize: number;
  totalPages: number;
  total: number;
};

export const PaginationControls: FC<Props> = ({
  page,
  pageSize,
  totalPages,
  total,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  const handlePageSizeChange = (newSize: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("pageSize", newSize.toString());
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handlePrevious = () => {
    if (page > 1) {
      handlePageChange(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      handlePageChange(page + 1);
    }
  };

  const handleFirst = () => {
    if (page > 1) {
      handlePageChange(1);
    }
  };

  const handleLast = () => {
    if (page < totalPages) {
      handlePageChange(totalPages);
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-black-100 bg-beige-50 px-6 py-4">
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium uppercase tracking-wide text-black-600">
          Par page :
        </span>
        <select
          value={pageSize}
          onChange={(e) => handlePageSizeChange(parseInt(e.target.value, 10))}
          className="cursor-pointer rounded-lg border border-black-200 bg-white px-3 py-2 text-sm text-black-900 font-medium focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-200"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleFirst}
          disabled={page === 1}
          className="cursor-pointer rounded-lg border border-black-200 bg-white p-2 text-black-900 hover:bg-black-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Première page"
        >
          ⇤
        </Button>
        <Button
          onClick={handlePrevious}
          disabled={page === 1}
          className="cursor-pointer rounded-lg border border-black-200 bg-white p-2 text-black-900 hover:bg-black-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Page précédente"
        >
          ←
        </Button>
        <Button
          onClick={handleNext}
          disabled={page === totalPages}
          className="cursor-pointer rounded-lg border border-black-200 bg-white p-2 text-black-900 hover:bg-black-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Page suivante"
        >
          →
        </Button>
        <Button
          onClick={handleLast}
          disabled={page === totalPages}
          className="cursor-pointer rounded-lg border border-black-200 bg-white p-2 text-black-900 hover:bg-black-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Dernière page"
        >
          ⇥
        </Button>
      </div>

      <div className="text-sm font-medium text-black-600 whitespace-nowrap">
        Page <span className="font-semibold text-black-800">{page}</span>/{<span className="font-semibold text-black-800">{totalPages}</span>} • <span className="text-black-500">{total} total</span>
      </div>
    </div>
  );
};
