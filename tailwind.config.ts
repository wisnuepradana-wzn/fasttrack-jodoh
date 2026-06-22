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
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        heading: ["var(--font-montserrat)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        navy: { 
          50: '#fcf3f3',
          100: '#f9e6e6',
          200: '#f1caca',
          300: '#e8a1a1',
          400: '#dd6d6d',
          500: '#E50914', 
          600: '#c50009',
          700: '#a50006',
          800: '#870509',
          900: '#70090c',
          950: '#3d0003',
        },
        slate: { 
          50: '#1c1c1c',   
          100: '#232323',  
          200: '#333333',  
          300: '#404040',
          400: '#666666',
          500: '#808080',
          600: '#b3b3b3',  
          700: '#cccccc',
          800: '#e5e5e5',  
          900: '#ffffff',  
          950: '#ffffff',
        }
      },
      backgroundColor: {
        white: '#141414',
      },
      boxShadow: {
        soft: "0 10px 40px -10px rgba(0,0,0,0.5)",
        lift: "0 20px 40px -10px rgba(0,0,0,0.7)"
      },
      borderRadius: {
        "2xl": "1.5rem"
      },
      backgroundImage: {
        "premium-gradient": "linear-gradient(180deg, rgba(20,20,20,0) 0%, #141414 100%)"
      }
    }
  },
  plugins: []
};

export default config;
