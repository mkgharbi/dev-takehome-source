import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { PaginationControls } from "./PaginationControls";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => new URLSearchParams(),
}));

describe("PaginationControls", () => {
  const defaultProps = {
    page: 1,
    pageSize: 10,
    totalPages: 5,
    total: 50,
  };

  beforeEach(() => {
    mockPush.mockClear();
  });

  describe("Pagination info display", () => {
    it("shows current page, total pages, and item count", () => {
      const { container } = render(<PaginationControls {...defaultProps} />);
      const info = container.querySelector(".text-sm.font-medium.text-black-600");
      expect(info?.textContent).toMatch(/Page 1\/5/);
      expect(info?.textContent).toMatch(/50 total/);
    });

    it("updates info when different page prop is passed", () => {
      const { container } = render(
        <PaginationControls {...defaultProps} page={3} totalPages={7} total={100} />
      );
      const info = container.querySelector(".text-sm.font-medium.text-black-600");
      expect(info?.textContent).toMatch(/Page 3\/7/);
      expect(info?.textContent).toMatch(/100 total/);
    });

    it("handles large numbers correctly", () => {
      const { container } = render(
        <PaginationControls page={1} pageSize={10} totalPages={1000} total={10000} />
      );
      const info = container.querySelector(".text-sm.font-medium.text-black-600");
      expect(info?.textContent).toContain("10000");
      expect(info?.textContent).toContain("1000");
    });
  });

  describe("Page size selector", () => {
    it("renders a single-select (not multiple) with current page size selected", () => {
      render(<PaginationControls {...defaultProps} pageSize={10} />);
      const select = screen.getByDisplayValue("10") as HTMLSelectElement;
      expect(select).toBeInTheDocument();
      expect(select).not.toHaveAttribute("multiple");
    });

    it("offers 5, 10, 20, 50 as page size options", () => {
      const { container } = render(<PaginationControls {...defaultProps} />);
      const options = Array.from(
        container.querySelectorAll("select option")
      ).map((o) => (o as HTMLOptionElement).value);
      expect(options).toEqual(["5", "10", "20", "50"]);
    });

    it("reflects updated pageSize when prop changes", () => {
      const { rerender } = render(
        <PaginationControls {...defaultProps} pageSize={10} />
      );
      expect(screen.getByDisplayValue("10")).toBeInTheDocument();

      rerender(<PaginationControls {...defaultProps} pageSize={20} />);
      expect(screen.getByDisplayValue("20")).toBeInTheDocument();
    });

    it("has cursor-pointer class", () => {
      const { container } = render(<PaginationControls {...defaultProps} />);
      expect(container.querySelector("select")).toHaveClass("cursor-pointer");
    });

    it("navigates to page 1 and updates pageSize in URL on change", () => {
      render(<PaginationControls {...defaultProps} page={3} pageSize={10} />);
      const select = screen.getByDisplayValue("10");
      fireEvent.change(select, { target: { value: "20" } });
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining("pageSize=20")
      );
      expect(mockPush).toHaveBeenCalledWith(expect.stringContaining("page=1"));
    });
  });

  describe("Navigation buttons", () => {
    it("renders exactly four navigation buttons", () => {
      render(<PaginationControls {...defaultProps} />);
      expect(screen.getAllByRole("button")).toHaveLength(4);
    });

    it("shows the correct unicode symbols", () => {
      const { container } = render(<PaginationControls {...defaultProps} />);
      expect(container.textContent).toContain("⇤");
      expect(container.textContent).toContain("←");
      expect(container.textContent).toContain("→");
      expect(container.textContent).toContain("⇥");
    });

    it("has French tooltips on each button", () => {
      render(<PaginationControls {...defaultProps} />);
      const [first, prev, next, last] = screen.getAllByRole("button");
      expect(first).toHaveAttribute("title", "Première page");
      expect(prev).toHaveAttribute("title", "Page précédente");
      expect(next).toHaveAttribute("title", "Page suivante");
      expect(last).toHaveAttribute("title", "Dernière page");
    });
  });

  describe("Disabled states", () => {
    it("disables first and previous buttons on page 1", () => {
      render(<PaginationControls {...defaultProps} page={1} />);
      const [first, prev] = screen.getAllByRole("button");
      expect(first).toBeDisabled();
      expect(prev).toBeDisabled();
    });

    it("disables next and last buttons on the final page", () => {
      render(<PaginationControls {...defaultProps} page={5} totalPages={5} />);
      const [, , next, last] = screen.getAllByRole("button");
      expect(next).toBeDisabled();
      expect(last).toBeDisabled();
    });

    it("enables all buttons on a middle page", () => {
      render(<PaginationControls {...defaultProps} page={3} totalPages={5} />);
      screen.getAllByRole("button").forEach((btn) => {
        expect(btn).not.toBeDisabled();
      });
    });

    it("disables all buttons when there is only one page", () => {
      render(
        <PaginationControls page={1} pageSize={50} totalPages={1} total={10} />
      );
      screen.getAllByRole("button").forEach((btn) => {
        expect(btn).toBeDisabled();
      });
    });

    it("disables next and last on the last page even with a different total", () => {
      render(
        <PaginationControls page={3} pageSize={10} totalPages={3} total={25} />
      );
      const [, , next, last] = screen.getAllByRole("button");
      expect(next).toBeDisabled();
      expect(last).toBeDisabled();
    });
  });

  describe("Button click navigation", () => {
    it("navigates to next page when next button is clicked", () => {
      render(<PaginationControls {...defaultProps} page={2} totalPages={5} />);
      const [, , next] = screen.getAllByRole("button");
      fireEvent.click(next);
      expect(mockPush).toHaveBeenCalledWith(expect.stringContaining("page=3"));
    });

    it("navigates to previous page when prev button is clicked", () => {
      render(<PaginationControls {...defaultProps} page={3} totalPages={5} />);
      const [, prev] = screen.getAllByRole("button");
      fireEvent.click(prev);
      expect(mockPush).toHaveBeenCalledWith(expect.stringContaining("page=2"));
    });

    it("navigates to first page when first button is clicked", () => {
      render(<PaginationControls {...defaultProps} page={4} totalPages={5} />);
      const [first] = screen.getAllByRole("button");
      fireEvent.click(first);
      expect(mockPush).toHaveBeenCalledWith(expect.stringContaining("page=1"));
    });

    it("navigates to last page when last button is clicked", () => {
      render(<PaginationControls {...defaultProps} page={2} totalPages={5} />);
      const [, , , last] = screen.getAllByRole("button");
      fireEvent.click(last);
      expect(mockPush).toHaveBeenCalledWith(expect.stringContaining("page=5"));
    });
  });

  describe("Button styling", () => {
    it("enabled buttons have cursor-pointer and hover classes", () => {
      const { container } = render(
        <PaginationControls {...defaultProps} page={2} totalPages={5} />
      );
      container.querySelectorAll("button").forEach((btn) => {
        if (!btn.disabled) {
          expect(btn).toHaveClass("cursor-pointer");
          expect(btn).toHaveClass("hover:bg-black-50");
        }
      });
    });

    it("disabled buttons have disabled:cursor-not-allowed class", () => {
      const { container } = render(<PaginationControls {...defaultProps} page={1} />);
      container.querySelectorAll("button").forEach((btn) => {
        if (btn.disabled) {
          expect(btn).toHaveClass("disabled:cursor-not-allowed");
        }
      });
    });
  });
});
