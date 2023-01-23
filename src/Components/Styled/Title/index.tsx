import * as React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';

export interface iProps extends TextProps {
  children?: string;
  purpose?: 'headline' | 'heading' | 'subheading';
  weight?: 'regular' | 'bold' | 'bolder';
}

export const Title: React.FC<iProps> = (props) => {
  let fontSizeCalc = 24;
  switch (props.purpose) {
    case 'headline':
      fontSizeCalc = 48;
      break;
    case 'heading':
      fontSizeCalc = 24;
      break;
    case 'subheading':
      fontSizeCalc = 16;
      break;
    default:
      fontSizeCalc = 24;
  }

  let weightCalc: any = 'normal';
  switch (props.weight) {
    case 'regular':
      weightCalc = 'normal';
      break;
    case 'bold':
      weightCalc = 'bold';
      break;
    case 'bolder':
      weightCalc = '900';
      break;
    default:
      weightCalc = 'normal';
  }

  const builtInStyle = StyleSheet.create({
    default: {
      fontSize: fontSizeCalc,
      fontWeight: weightCalc,
      fontFamily: 'Montserrat-Regular',
      flex: 1,
      alignSelf: 'stretch',
    },
    overrides: {},
  });

  return <Text style={[builtInStyle.default, props.style, builtInStyle.overrides]}>{props.children}</Text>;
};
