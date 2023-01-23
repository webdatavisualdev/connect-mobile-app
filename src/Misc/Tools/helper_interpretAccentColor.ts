import Colors from '../Colors';
import { AccentColors } from './../../Misc';
import { AccentColors as enumAccentColors } from './../Types/iFeedItem';

/**
 * @returns [AccentColor, ContrastingColor]
 */
export const helper_interpretAccentColor = (AccentColor: AccentColors) => {
  const colors = enumAccentColors;

  switch (AccentColor) {
    case colors.DarkBlue:
      return [MapColor('darkblue'), 'white'];
    case colors.Green:
      return [MapColor('green'), 'white'];
    case colors.LightBlue:
      return [MapColor('lightblue'), 'white'];
    case colors.LightRed:
      return [MapColor('lightred'), 'white'];
    case colors.Orange:
      return [MapColor('orange'), 'white'];
    case colors.Purple:
      return [MapColor('purple'), 'white'];
    default:
      return [MapColor('black'), 'white'];
  }
};

const MapColor = (typeColor: string) => {
  if (!typeColor) return;
  switch (typeColor.toLowerCase()) {
    case 'purple':
      return Colors.finn;
    case 'green':
      return Colors.verdunGreen;
    case 'darkblue':
      return Colors.veniceBlue;
    case 'lightblue':
      return Colors.matisse;
    case 'lightred':
      return Colors.cerise;
    default:
      return typeColor;
  }
};

export default helper_interpretAccentColor;
