import * as React from 'react';
import { TextProps, StyleSheet } from 'react-native';
import { Text as RNText } from 'native-base';

// : Hooks
import H, { iReduxState } from './../../../Hooks';

export interface iProps extends TextProps {
  children?: string | string[];
  debug?: boolean;
  size?: 'tiny' | 'small' | 'medium' | 'large' | 'largest';
  face?:
    | 'Montserrat-Black'
    | 'Montserrat-BlackItalic'
    | 'Montserrat-Bold'
    | 'Montserrat-BoldItalic'
    | 'Montserrat-ExtraBold'
    | 'Montserrat-ExtraBoldItalic'
    | 'Montserrat-ExtraLight'
    | 'Montserrat-ExtraLightItalic'
    | 'Montserrat-Italic'
    | 'Montserrat-Light'
    | 'Montserrat-LightItalic'
    | 'Montserrat-Medium'
    | 'Montserrat-MediumItalic'
    | 'Montserrat-Regular'
    | 'Montserrat-SemiBold'
    | 'Montserrat-SemiBoldItalic'
    | 'Montserrat-Thin'
    | 'Montserrat-ThinItalic';
}

const sizes = {
  tiny: 12,
  small: 16,
  medium: 20,
  large: 24,
  largest: 30,
};

export const Text: React.FC<iProps> = (props) => {
  const debug = H.NPM.redux.useSelector((s: iReduxState) => s.Dev.visualDebugging);

  const builtInStyle = StyleSheet.create({
    default: {
      fontFamily: 'Montserrat-Regular',
      fontSize: props.size ? sizes[props.size] : sizes.small,
    },
    overrides: {},
    debug: {
      borderWidth: 1,
    },
  });

  return (
    <RNText {...props} style={[builtInStyle.default, props.style, builtInStyle.overrides, debug ? builtInStyle.debug : undefined]}>
      {props.children}
    </RNText>
  );
};
