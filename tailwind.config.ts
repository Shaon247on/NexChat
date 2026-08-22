import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-syne)", "Syne", "sans-serif"],
        "dm-sans": ["var(--font-dm-sans)", "DM Sans", "sans-serif"],
        body: ["var(--font-dm-sans)", "DM Sans", "sans-serif"],
      },
      colors: {
        navy: {
          DEFAULT: "rgb(10 15 44)",
          mid: "rgb(15 23 60)",
          light: "rgb(20 32 80)",
        },
      },
      animation: {
        "float-slow": "float 8s ease-in-out infinite",
        "spin-slow": "spin 25s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
      backgroundImage: {
        "blue-radial": "radial-gradient(ellipse at center, rgba(37,99,235,0.3) 0%, transparent 65%)",
      },
    },
  },
  plugins: [],
};

export default config;