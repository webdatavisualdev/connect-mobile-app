import * as React from 'react';
import { View, NativeBase } from 'native-base';

export interface iProps extends NativeBase.View {
  children?: JSX.Element;
}

export default (props: iProps) => {
  return <View>{props.children}</View>;
};
