/* eslint-disable fp/no-mutation */
const Theme = {
  textColor: 'black',
  fontSize: 14,
  axis: {
    domain: {
      line: {
        stroke: '#777777',
        strokeWidth: 1,
      },
    },
    ticks: {
      line: {
        stroke: 'black',
        strokeWidth: 9,
      },
      fontSize: 12,
    },
  },
  grid: {
    line: {
      stroke: 'black',
      strokeWidth: 2,
    },
  },
};

Theme.Biden = '#3c1874';
Theme.Trump = '#932432';

export default Theme;
