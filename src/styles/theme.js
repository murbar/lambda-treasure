import { media, addAlpha } from './helpers';

const colors = {
  cream: 'hsl(39, 77%, 95%)',
  darkCream: 'hsl(39, 86%, 84%)',
  offBlack: '#222',
  orange: 'hsl(18, 84%, 44%)',
  gold: '#ffcf40'
};

const theme = {
  colors: {
    ...colors,
    background: colors.cream,
    foreground: colors.offBlack,
    primary: colors.orange
  },
  backgroundGradient: `radial-gradient(ellipse at center, transparent 50%, ${
    colors.darkCream
  } 100%);`,
  inputBorderRadius: `0.5rem`,
  font: "'Alegreya Sans'",
  headingFont: "'Passion One'",
  hudShadow: '0.25rem 0.25rem 1rem rgba(0, 0, 0, 0.2)',
  map: {
    roomColor: '#f6d6ad',
    currentRoomColor: '#BE1C29',
    labelColor: '#5D3411'
  },
  queue: {
    bgColor: addAlpha(colors.cream, 0.8)
  },
  media
};

export default theme;
