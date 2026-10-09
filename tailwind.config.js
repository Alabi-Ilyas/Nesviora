/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        vaulta: {
          platinum: "#EAEBED",
          cerulean: "#006989",
          "cerulean-light": "#0A7A9E",
          "cerulean-dark": "#004A63",
          spring: "#0CF574",
          "spring-dark": "#0AD862",
          orange: "#FF7D00",
          black: "#000300",
          text: "#000300",
          "dark-text": "#F7F9FA",
          bg: "#F7F9FA",
          surface: "#FFFFFF",
          "dark-bg": "#080C10",
          "dark-surface": "#101820",
          "dark-border": "#26323B",
          border: "#E4E7EC",
          muted: "#667085",
          "dark-muted": "#98A2B3",
          warning: "#FFB020",
          danger: "#EF4444",
          success: "#0CF574",
        },
      },
      boxShadow: {
        vaulta: "0 10px 30px rgba(0, 0, 0, 0.06)",
        "vaulta-lg": "0 20px 50px rgba(0, 0, 0, 0.1)",
        "vaulta-sm": "0 2px 8px rgba(0, 0, 0, 0.04)",
      },
      borderRadius: {
        vaulta: "14px",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-in-right": "slideInRight 0.3s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },
    },
  },
  plugins: [],
};
