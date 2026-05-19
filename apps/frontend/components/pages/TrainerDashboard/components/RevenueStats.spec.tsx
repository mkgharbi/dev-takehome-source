import { render, screen } from "@testing-library/react";
import React from "react";

import { RevenueStats } from "./RevenueStats";

// Mock the SWR hook — keeps tests fast and deterministic
jest.mock("@/services/api/trainer/trainer", () => ({
  useTrainerRevenue: jest.fn(),
}));

// Mock formatEur to return predictable strings in assertions
jest.mock("@repo/utils", () => ({
  formatEur: (cents: number) => `${cents / 100}€`,
}));

import { useTrainerRevenue } from "@/services/api/trainer/trainer";

const mockUseRevenue = useTrainerRevenue as jest.Mock;

const baseRevenue = {
  confirmedRevenueCents: 10000,
  pendingRevenueCents: 3000,
  cancelledRevenueCents: 2000,
  totalRevenueCents: 13000,
  monthTotalRevenueCents: 4000,
  monthConfirmedRevenueCents: 3500,
  monthPendingRevenueCents: 500,
  monthCancelledRevenueCents: 800,
};

describe("RevenueStats", () => {
  beforeEach(() => {
    mockUseRevenue.mockReset();
  });

  describe("Loading state", () => {
    it("renders two skeleton cards while loading", () => {
      mockUseRevenue.mockReturnValue({ data: undefined, isLoading: true });
      const { container } = render(<RevenueStats trainerId="t1" />);
      const skeletons = container.querySelectorAll(".animate-pulse");
      expect(skeletons).toHaveLength(2);
    });

    it("renders nothing when not loading and data is absent", () => {
      mockUseRevenue.mockReturnValue({ data: undefined, isLoading: false });
      const { container } = render(<RevenueStats trainerId="t1" />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe("Card labels", () => {
    it("renders two cards: total and this month", () => {
      mockUseRevenue.mockReturnValue({ data: baseRevenue, isLoading: false });
      render(<RevenueStats trainerId="t1" />);
      expect(screen.getByText("Revenu total")).toBeInTheDocument();
      expect(screen.getByText("Ce mois-ci")).toBeInTheDocument();
    });
  });

  describe("Total amounts", () => {
    it("displays totalRevenueCents as the all-time headline figure", () => {
      mockUseRevenue.mockReturnValue({ data: baseRevenue, isLoading: false });
      render(<RevenueStats trainerId="t1" />);
      expect(screen.getByText("130€")).toBeInTheDocument(); // 13000 / 100
    });

    it("displays monthTotalRevenueCents as the month headline figure", () => {
      mockUseRevenue.mockReturnValue({ data: baseRevenue, isLoading: false });
      render(<RevenueStats trainerId="t1" />);
      expect(screen.getByText("40€")).toBeInTheDocument(); // 4000 / 100
    });
  });

  describe("Breakdown rows — Confirmé", () => {
    it("shows confirmed amount for all-time card", () => {
      mockUseRevenue.mockReturnValue({ data: baseRevenue, isLoading: false });
      render(<RevenueStats trainerId="t1" />);
      expect(screen.getByText("100€")).toBeInTheDocument(); // 10000 / 100
    });

    it("shows month confirmed amount for month card", () => {
      mockUseRevenue.mockReturnValue({ data: baseRevenue, isLoading: false });
      render(<RevenueStats trainerId="t1" />);
      expect(screen.getByText("35€")).toBeInTheDocument(); // 3500 / 100
    });
  });

  describe("Breakdown rows — En attente", () => {
    it("always renders two 'En attente (inclus)' rows (one per card)", () => {
      mockUseRevenue.mockReturnValue({ data: baseRevenue, isLoading: false });
      render(<RevenueStats trainerId="t1" />);
      const pendingRows = screen.getAllByText("En attente (inclus)");
      expect(pendingRows).toHaveLength(2);
    });

    it("shows ~ prefix on the pending amount", () => {
      mockUseRevenue.mockReturnValue({ data: baseRevenue, isLoading: false });
      const { container } = render(<RevenueStats trainerId="t1" />);
      // pending all-time = 3000 → "30€", month pending = 500 → "5€"
      const spans = Array.from(container.querySelectorAll(".text-black-500 ~ span, .text-black-500 + span, span.font-medium"))
        .filter((el) => el.textContent?.startsWith("~"));
      expect(spans.length).toBeGreaterThanOrEqual(2);
    });

    it("still shows pending row when monthPendingRevenueCents is 0", () => {
      mockUseRevenue.mockReturnValue({
        data: { ...baseRevenue, monthPendingRevenueCents: 0, monthTotalRevenueCents: 3500 },
        isLoading: false,
      });
      render(<RevenueStats trainerId="t1" />);
      // Both cards still have "En attente (inclus)"
      expect(screen.getAllByText("En attente (inclus)")).toHaveLength(2);
    });
  });

  describe("Breakdown rows — Annulé", () => {
    it("shows the cancelled row when cancelledRevenueCents > 0", () => {
      mockUseRevenue.mockReturnValue({ data: baseRevenue, isLoading: false });
      render(<RevenueStats trainerId="t1" />);
      const cancelledRows = screen.getAllByText("Annulé");
      expect(cancelledRows.length).toBeGreaterThanOrEqual(1);
    });

    it("hides the cancelled row when cancelledRevenueCents is 0", () => {
      mockUseRevenue.mockReturnValue({
        data: {
          ...baseRevenue,
          cancelledRevenueCents: 0,
          monthCancelledRevenueCents: 0,
        },
        isLoading: false,
      });
      render(<RevenueStats trainerId="t1" />);
      expect(screen.queryByText("Annulé")).not.toBeInTheDocument();
    });

    it("shows − prefix on the cancelled amount", () => {
      mockUseRevenue.mockReturnValue({ data: baseRevenue, isLoading: false });
      const { container } = render(<RevenueStats trainerId="t1" />);
      const cancelledAmounts = Array.from(
        container.querySelectorAll("span.font-medium.text-red-600")
      ).filter((el) => el.textContent?.startsWith("−"));
      expect(cancelledAmounts.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("Passes trainerId to the hook", () => {
    it("calls useTrainerRevenue with the provided trainerId", () => {
      mockUseRevenue.mockReturnValue({ data: undefined, isLoading: true });
      render(<RevenueStats trainerId="abc-123" />);
      expect(mockUseRevenue).toHaveBeenCalledWith("abc-123");
    });
  });
});
