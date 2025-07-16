import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Source Serif Pro"', "serif"],
        sans: ['"Architects Daughter"', "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
