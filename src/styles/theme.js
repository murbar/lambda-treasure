import { media, addAlpha } from './helpers';

// const colors = {
//   offWhite: 'hsl(0, 0%, 94%)',
//   cream: 'hsl(39, 77%, 95%)',
//   darkCream: 'hsl(39, 86%, 84%)',
//   brown: 'hsl(28, 69%, 22%)',
//   offBlack: '#222',
//   orange: 'hsl(18, 84%, 44%)',
//   red: 'hsl(355, 87%, 33%)',
//   gold: '#ffcf40'
// };

const colors = {
  offWhite: 'hsl(0, 0%, 94%)',
  cream: 'hsl(42, 100%, 94%)',
  darkCream: 'hsl(41, 81%, 79%)',
  brown: 'hsl(28, 69%, 22%)',
  offBlack: '#222',
  orange: 'hsl(18, 84%, 44%)',
  red: 'hsl(355, 87%, 33%)',
  red2: 'hsl(356, 77%, 57%)',
  green: 'hsl(58, 17%, 28%)',
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
    // roomColor: '#f6d6ad',
    roomColor: colors.darkCream,
    labelColor: colors.brown,
    currentRoomColor: colors.brown,
    currentRoomLabelColor: colors.cream,
    focusRoomColor: colors.gold,
    unknownConnectionColor: '#ccc'
    // focusRoomLabelColor: colors.cream
  },
  hud: {
    blendBgColor: addAlpha(colors.cream, 0.8)
  },
  inventory: {
    itemBgGradient: `radial-gradient(ellipse at center, lightskyblue 0%, dodgerblue 100%);`
  },
  labels: {
    red: '#e74c3c',
    orange: '#f39c12',
    yellow: '#f1c40f',
    green: '#2ecc71',
    blue: '#3498db',
    purple: '#9b59b6'
  },
  media
};

export default theme;
