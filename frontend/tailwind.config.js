/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        wine: {
          700: "#7B2F49",
          500: "#8F3857"
        },
        gold: {
          600: "#BC9A7F",
          300: "#DFD0B7"
        },
        base: {
          bg: "#F7F7F7",
          surface: "#EFEFEE",
        },
        text: {
          main: "#1F1F1F",
          muted: "#666666",
        }
      },
      borderRadius: {
        md: "12px",
        lg: "16px",
        full: "999px"
      },
      boxShadow: {
        soft: "0 8px 20px rgba(0,0,0,0.04)"
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        inter: ["Inter", "sans-serif"]
      }
    },
  },
  plugins: [],
}
