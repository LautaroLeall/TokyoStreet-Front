/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#0C0030",
          900: "#18003C",
          800: "#241552",
          700: "#311E6B",
        },
        pink: {
          400: "#FF4FA3",
          500: "#F00078",
          600: "#CC0060",
          700: "#A3004D",
        },
        cyan: {
          300: "#84F0FC",
          400: "#54D8FC",
          500: "#22BEE8",
        },
        lilac: {
          200: "#D6CCF5",
          300: "#B9A8E6",
          400: "#9480CC",
        },
        ok: "#3DDC97",
        warn: "#FFC857",
        bad: "#FF5A6E",
      },
      fontFamily: {
        display: ['"Russo One"', "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
        jp: ['"Noto Sans JP"', "sans-serif"],
      },
      boxShadow: {
        "glow-pink":
          "0 0 10px rgba(240, 0, 120, 0.55), 0 0 28px rgba(240, 0, 120, 0.28)",
        "glow-pink-sm": "0 0 8px rgba(240, 0, 120, 0.38)",
        "glow-cyan":
          "0 0 10px rgba(132, 240, 252, 0.5), 0 0 28px rgba(84, 216, 252, 0.25)",
        "glow-cyan-sm": "0 0 8px rgba(132, 240, 252, 0.35)",
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "20px",
        pill: "999px",
      },
      backgroundImage: {
        "grad-brand":
          "linear-gradient(135deg, #F00078 0%, #7A1CFF 55%, #54D8FC 100%)",
        "grad-night": "linear-gradient(180deg, #18003C 0%, #0C0030 100%)",
      },
    },
  },
  plugins: [],
};
