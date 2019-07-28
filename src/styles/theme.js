import { media } from './helpers';

const colors = {
  cream: 'hsl(39, 77%, 95%)',
  darkCream: 'hsl(39, 86%, 84%)',
  offBlack: '#222',
  orange: 'hsl(18, 84%, 44%)'
};

// const addAlpha = (hsl, alpha) => {
//   return `${hsl.slice(0, -1)}, ${alpha})`;
// };

const theme = {
  colors: {
    ...colors,
    background: colors.cream,
    foreground: colors.offBlack,
    primary: colors.orange
  },
  backgroundGradient: `radial-gradient(ellipse at center, ${colors.cream} 50%, ${
    colors.darkCream
  } 100%);`,
  inputBorderRadius: `0.5rem`,
  fontFamily: "'Alegreya Sans', sans-serif",
  headingFontFamily: "'Bungee', sans-serif",
  media
};

export default theme;
