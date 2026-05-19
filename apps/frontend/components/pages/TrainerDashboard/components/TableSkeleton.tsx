"use client";

export const TableSkeleton = () => {
  return (
    <div className="rounded-lg border border-black-100 bg-white overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-black-100 bg-black-50">
            <th className="px-4 py-3 text-left text-xs font-semibold text-black-600">
              <div className="h-4 w-20 animate-pulse rounded bg-black-200" />
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-black-600">
              <div className="h-4 w-24 animate-pulse rounded bg-black-200" />
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-black-600">
              <div className="h-4 w-20 animate-pulse rounded bg-black-200" />
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-black-600">
              <div className="h-4 w-16 animate-pulse rounded bg-black-200" />
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-black-600">
              <div className="h-4 w-16 animate-pulse rounded bg-black-200" />
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }).map((_, idx) => (
            <tr key={idx} className="border-b border-black-50 hover:bg-beige-50 transition-colors">
              <td className="px-4 py-4">
                <div className="h-4 w-32 animate-pulse rounded bg-black-100" />
              </td>
              <td className="px-4 py-4">
                <div className="h-4 w-40 animate-pulse rounded bg-black-100" />
              </td>
              <td className="px-4 py-4">
                <div className="h-4 w-28 animate-pulse rounded bg-black-100" />
              </td>
              <td className="px-4 py-4">
                <div className="h-4 w-12 animate-pulse rounded bg-black-100" />
              </td>
              <td className="px-4 py-4">
                <div className="h-4 w-20 animate-pulse rounded bg-black-100" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
