import * as React from 'react';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { IconProps } from 'react-native-vector-icons/Icon';

export interface iProps extends Omit<IconProps, 'size'> {
  size?: 'tiny' | 'small' | 'medium' | 'large' | 'largest' | number;
}

const sizes = {
  tiny: 12,
  small: 16,
  medium: 20,
  large: 24,
  largest: 30,
};

export const Icon: React.FC<iProps> = (props) => {
  if (typeof props.size === 'string') {
    props.size = sizes[props.size];
  }

  return <IonIcon {...props} size={props.size} style={[props.style, { fontWeight: '100' }]} />;
};
