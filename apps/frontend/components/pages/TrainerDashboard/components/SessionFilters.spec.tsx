import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SessionFilters } from "./SessionFilters";

const mockPush = jest.fn();

// Default mock: "pending" pre-selected via URL param
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => ({
    get: (key: string) => {
      if (key === "status") return "pending";
      return "";
    },
    toString: () => "status=pending",
  }),
}));

describe("SessionFilters", () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  describe("Status filter rendering", () => {
    it("renders a multi-select for status", () => {
      const { container } = render(<SessionFilters />);
      const select = container.querySelector("select[multiple]");
      expect(select).toBeInTheDocument();
      expect(select).toHaveAttribute("multiple");
    });

    it("offers three status options: pending, confirmed, cancelled", () => {
      const { container } = render(<SessionFilters />);
      const options = Array.from(
        container.querySelectorAll("select[multiple] option")
      ).map((o) => (o as HTMLOptionElement).value);
      expect(options).toEqual(["pending", "confirmed", "cancelled"]);
    });

    it("labels the options in French", () => {
      const { container } = render(<SessionFilters />);
      const labels = Array.from(
        container.querySelectorAll("select[multiple] option")
      ).map((o) => o.textContent);
      expect(labels).toContain("En attente");
      expect(labels).toContain("Confirmée");
      expect(labels).toContain("Annulée");
    });

    it("shows a helper text for multi-select usage", () => {
      render(<SessionFilters />);
      expect(
        screen.getByText("Ctrl/Cmd + Click pour sélectionner plusieurs")
      ).toBeInTheDocument();
    });
  });

  describe("Status badges", () => {
    it("shows a blue badge for the pre-selected pending status", () => {
      const { container } = render(<SessionFilters />);
      const badge = container.querySelector(".bg-blue-100.text-blue-700");
      expect(badge).toBeInTheDocument();
      expect(badge?.textContent).toBe("En attente");
    });

    it("applies correct color classes per status", () => {
      const { container } = render(<SessionFilters />);
      // pending = blue
      expect(container.querySelector(".bg-blue-100.text-blue-700")).toBeInTheDocument();
    });
  });

  describe("Date range validation", () => {
    it("shows an error message when end date is before start date", async () => {
      const { container } = render(<SessionFilters />);
      const [fromInput, toInput] = container.querySelectorAll("input[type='date']");

      fireEvent.change(fromInput, { target: { value: "2025-12-31" } });
      fireEvent.change(toInput, { target: { value: "2025-01-01" } });

      await waitFor(() => {
        expect(
          screen.getByText("La date de fin doit être après la date de début", {
            exact: false,
          })
        ).toBeInTheDocument();
      });
    });

    it("applies red styling to date inputs when the range is invalid", async () => {
      const { container } = render(<SessionFilters />);
      const [fromInput, toInput] = container.querySelectorAll("input[type='date']");

      fireEvent.change(fromInput, { target: { value: "2025-12-31" } });
      fireEvent.change(toInput, { target: { value: "2025-01-01" } });

      await waitFor(() => {
        expect(fromInput).toHaveClass("border-red-300", "bg-red-50");
        expect(toInput).toHaveClass("border-red-300", "bg-red-50");
      });
    });

    it("clears the error once the date range becomes valid", async () => {
      const { container } = render(<SessionFilters />);
      const [fromInput, toInput] = container.querySelectorAll("input[type='date']");

      fireEvent.change(fromInput, { target: { value: "2025-12-31" } });
      fireEvent.change(toInput, { target: { value: "2025-01-01" } });

      // Fix the end date
      fireEvent.change(toInput, { target: { value: "2026-01-01" } });

      await waitFor(() => {
        expect(
          screen.queryByText("La date de fin doit être après la date de début", {
            exact: false,
          })
        ).not.toBeInTheDocument();
      });
    });

    it("removes red styling after the range is corrected", async () => {
      const { container } = render(<SessionFilters />);
      const [fromInput, toInput] = container.querySelectorAll("input[type='date']");

      fireEvent.change(fromInput, { target: { value: "2025-12-31" } });
      fireEvent.change(toInput, { target: { value: "2025-01-01" } });
      fireEvent.change(toInput, { target: { value: "2026-01-01" } });

      await waitFor(() => {
        expect(fromInput).not.toHaveClass("border-red-300");
        expect(toInput).not.toHaveClass("border-red-300");
      });
    });
  });

  describe("Clear filters button", () => {
    it("shows the clear button when a filter is active (pending pre-selected)", () => {
      render(<SessionFilters />);
      expect(screen.getByText("Réinitialiser les filtres")).toBeInTheDocument();
    });

    it("calls onApplyFilters with empty values when the button is clicked", async () => {
      const mockCallback = jest.fn();
      render(<SessionFilters onApplyFilters={mockCallback} />);

      fireEvent.click(screen.getByText("Réinitialiser les filtres"));

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith({
          status: [],
          from: "",
          to: "",
        });
      });
    });

    it("hides the clear button after clicking it", async () => {
      const mockCallback = jest.fn();
      render(<SessionFilters onApplyFilters={mockCallback} />);

      fireEvent.click(screen.getByText("Réinitialiser les filtres"));

      await waitFor(() => {
        expect(
          screen.queryByText("Réinitialiser les filtres")
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Instant filter application via callback", () => {
    it("calls onApplyFilters immediately on date change", async () => {
      const mockCallback = jest.fn();
      const { container } = render(
        <SessionFilters onApplyFilters={mockCallback} />
      );

      const [fromInput] = container.querySelectorAll("input[type='date']");
      fireEvent.change(fromInput, { target: { value: "2025-06-01" } });

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({ from: "2025-06-01" })
        );
      });
    });

    it("calls onApplyFilters with selected statuses on multi-select change", async () => {
      const mockCallback = jest.fn();
      const user = userEvent.setup();
      const { container } = render(
        <SessionFilters onApplyFilters={mockCallback} />
      );

      const select = container.querySelector("select[multiple]") as HTMLSelectElement;
      await user.selectOptions(select, ["confirmed"]);

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalled();
        const lastCall = mockCallback.mock.calls.at(-1)?.[0];
        expect(lastCall.status).toContain("confirmed");
      });
    });
  });

  describe("URL navigation (no callback mode)", () => {
    it("pushes updated URL params when a date filter changes", async () => {
      const { container } = render(<SessionFilters />);
      const [fromInput] = container.querySelectorAll("input[type='date']");

      fireEvent.change(fromInput, { target: { value: "2025-03-15" } });

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith(
          expect.stringContaining("from=2025-03-15")
        );
      });
    });
  });
});
