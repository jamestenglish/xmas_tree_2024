import type { Config } from "tailwindcss";
import { COLORS } from "./app/constants/colors";
import CANVAS from "./app/constants/canvas";
export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        dkblue: COLORS.PRIMARY,
        pastel: COLORS.PASTEL,
        ltblue: COLORS.SECONDARY,
        snow: COLORS.BG,
        error: COLORS.ERROR,
      },
      fontFamily: {
        main: [`"${CANVAS.FONT}"`],
      },
    },
  },
  plugins: [],
} satisfies Config;
