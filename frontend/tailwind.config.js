/** @type {import('tailwindcss').Config} */
/* eslint-env node */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        wine: {
          700: "#7B2F49",
          500: "#8F3857",
          400: "#A85774"
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
        },
        // Paleta Dark Mode com Alto Contraste
        dark: {
          bg: {
            primary: "#0E0E0E",    // Fundo da página - muito escuro
            secondary: "#111111",   // Fundo alternativo
          },
          surface: {
            primary: "#1A1A1A",     // Fundo dos cards - cinza mais claro
            secondary: "#1F1F1F",   // Superfície secundária
            elevated: "#242424",    // Superfícies elevadas (modais)
            border: "rgba(255, 255, 255, 0.08)", // Bordas sutis
          },
          text: {
            primary: "#F2F2F2",     // Texto principal - quase branco
            secondary: "#CFCFCF",   // Subtítulos - cinza claro
            muted: "#A8A8A8",       // Labels - cinza intermediário
            disabled: "#707070",    // Texto desabilitado
          },
          wine: {
            primary: "#A85774",     // Vinho mais claro para dark mode
            secondary: "#C97A91",   // Vinho ainda mais claro
            text: "#E8B4C5",        // Texto em tom vinho claro
          },
          gold: {
            primary: "#DFD0B7",     // Dourado para dark mode
            secondary: "#E8DACA",   // Dourado mais claro
          },
          tag: {
            bg: "#2D1F1A",          // Fundo da tag (mais claro que card)
            text: "#E8DACA",        // Texto da tag
          }
        }
      },
      borderRadius: {
        md: "12px",
        lg: "16px",
        full: "999px"
      },
      boxShadow: {
        soft: "0 8px 20px rgba(0,0,0,0.04)",
        "dark-card": "0 4px 16px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)"
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        inter: ["Inter", "sans-serif"]
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      },
      animation: {
        slideUp: 'slideUp 0.3s ease-out'
      }
    },
  },
  plugins: [],
}
