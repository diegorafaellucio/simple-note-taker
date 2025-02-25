/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/apps/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: "#FAF1E3",
        primary: "#8B5A2B",
        inputBackground: "#FDF6EB",
        buttonBackground: "#8B5A2B",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif", "var(--font-inria)"],
        inria: ["var(--font-inria)", "serif"],
      },
      fontSize: {
        "heading-lg": ["48px", "57.55px"], // Custom font size with line height
      },
    },
  },
  plugins: [],
};

