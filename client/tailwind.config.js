import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        dark: {
          colors: {
            background: "#0F172A",
            foreground: "#E2E8F0",
            focus: "#3B82F6",
            content1: {
              DEFAULT: "#1E293B",
              foreground: "#F8FAFC"
            },
            content2: {
              DEFAULT: "#334155",
              foreground: "#F8FAFC"
            },
            content3: {
              DEFAULT: "#475569",
              foreground: "#F8FAFC"
            },
            content4: {
              DEFAULT: "#64748B",
              foreground: "#F8FAFC"
            },
            primary: {
              50: "#EFF6FF",
              100: "#DBEAFE",
              200: "#BFDBFE",
              300: "#93C5FD",
              400: "#60A5FA",
              500: "#3B82F6",
              600: "#2563EB",
              700: "#1D4ED8",
              800: "#1E40AF",
              900: "#1E3A8A",
              DEFAULT: "#3B82F6",
              foreground: "#FFFFFF"
            },
            secondary: {
              50: "#F8FAFC",
              100: "#F1F5F9",
              200: "#E2E8F0",
              300: "#CBD5E1",
              400: "#94A3B8",
              500: "#64748B",
              600: "#475569",
              700: "#334155",
              800: "#1E293B",
              900: "#0F172A",
              DEFAULT: "#64748B",
              foreground: "#FFFFFF"
            }
          }
        }
      }
    })
  ],
};
