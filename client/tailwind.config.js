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
                light: {
                    colors: {
                        background: "#FFFFFF",
                        foreground: "#11181C",
                        primary: {
                            50: "#FFF9E6",
                            100: "#FFF3CC",
                            200: "#FFE799",
                            300: "#FFDB66",
                            400: "#FFCF33",
                            500: "#FFC300", // Primary yellow
                            600: "#CC9C00",
                            700: "#997500",
                            800: "#664E00",
                            900: "#332700",
                            DEFAULT: "#FFC300",
                            foreground: "#000000",
                        },
                        secondary: {
                            50: "#FFF2E6",
                            100: "#FFE5CC",
                            200: "#FFCB99",
                            300: "#FFB166",
                            400: "#FF9733",
                            500: "#FF7D00", // Orange
                            600: "#CC6400",
                            700: "#994B00",
                            800: "#663200",
                            900: "#331900",
                            DEFAULT: "#FF7D00",
                            foreground: "#000000",
                        },
                    },
                },
            },
        }),
    ],
};
