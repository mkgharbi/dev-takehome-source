import type { Config } from "tailwindcss";

/**
 * Shared Tailwind theme — Certalis brand palette (minimal subset).
 * Apps extend this config and supply their own `content` globs.
 */
const config: Omit<Config, "content"> = {
  theme: {
    extend: {
      colors: {
        beige: {
          50: "#FBF9F7",
          100: "#EEE7DF",
          700: "#AF804F",
        },
        black: {
          50: "#F2F6F7",
          100: "#DEE8EA",
          200: "#C1D2D6",
          300: "#98B2BB",
          400: "#698A98",
          500: "#506F7C",
          600: "#435A67",
          700: "#344047",
          800: "#181D21",
          900: "#111315",
        },
        orange: {
          50: "#FFF6EE",
          100: "#FDF3EC",
          400: "#ED8340",
          500: "#EA642A",
        },
        green: {
          100: "#DEF6E9",
          500: "#4ED37D",
          600: "#3DBB7A",
          700: "#276553",
        },
        red: {
          100: "#FCE7F3",
          500: "#F34141",
          600: "#DA1C1C",
          700: "#8A4747",
        },
        blue: {
          100: "#DEE5F6",
          700: "#2C5AD0",
        },
        violet: {
          100: "#EDEBFA",
          700: "#6C49A3",
        },
        placeholder: "#A0A7B2",
      },
      fontFamily: {
        sans: ["var(--font-public-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "8px",
      },
    },
  },
};

export default config;
