import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e3a8a",
          900: "#0f172a",
          950: "#081120"
        }
      },
      boxShadow: {
        soft: "0 10px 30px rgba(8, 17, 32, 0.08)",
        lift: "0 16px 40px rgba(8, 17, 32, 0.12)"
      },
      borderRadius: {
        "2xl": "1.25rem"
      },
      backgroundImage: {
        "premium-gradient":
          "radial-gradient(circle at top, rgba(59,130,246,0.16), transparent 34%), linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0))"
      }
    }
  },
  plugins: []
};

export default config;
