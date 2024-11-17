/* eslint-disable no-undef */
const withMT = require("@material-tailwind/react/utils/withMT");
const colors = require('tailwindcss/colors');
 
module.exports = withMT({
  darkMode: 'media',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "path-to-your-node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "path-to-your-node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ...colors, // Include all Tailwind default colors
       
      },
    },
  },
  plugins: [],
});