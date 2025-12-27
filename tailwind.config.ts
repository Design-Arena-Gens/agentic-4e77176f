import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f5f7ff",
          100: "#e5ebff",
          200: "#cdd8ff",
          300: "#a5baff",
          400: "#7a93ff",
          500: "#566dff",
          600: "#3a4aff",
          700: "#2c37d6",
          800: "#1d2599",
          900: "#141a6d"
        }
      }
    }
  },
  plugins: []
};

export default config;
