import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#18212f",
        mist: "#f7f7fb",
        cedar: "#245b52",
        berry: "#b73758",
      },
      boxShadow: {
        soft: "0 18px 45px rgba(24, 33, 47, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
