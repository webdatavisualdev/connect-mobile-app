import * as React from 'react';
import { StyleProp, StyleSheet, TextStyle, ViewStyle } from 'react-native';

// : Hooks
import H, { iReduxState } from './../../../Hooks';

// : Components
import C from './../../../Components';

export interface iProps {
  borderStyles?: StyleProp<ViewStyle>;
  headerStyles?: StyleProp<TextStyle>;
  wrappingElementStyles?: StyleProp<ViewStyle>;

  custom?: boolean;
  required?: boolean;
  iconName?: string;
  header?: string;
  selectedState: any;
  options: iOption[];
}

export interface iOption {
  label: string;
  key: string;
}

export const Picker: React.FC<iProps> = (props) => {
  const logPress = H.Logs.useLog_userPress({ source: 'Components/Picker' });
  const debug = H.NPM.redux.useSelector((s: iReduxState) => s.Dev.visualDebugging);

  props.options = props.options.sort((a, b) => (a.label > b.label ? 0 : -1));

  const headerStyle = StyleSheet.create({
    default: {
      fontWeight: 'bold',
      color: 'grey',
    },
    overrides: {},
    debug: {},
  });

  const wrapperStyle = StyleSheet.create({
    default: {
      flexDirection: 'column',
      flex: 1,
    },
    overrides: {},
    debug: {},
  });

  const borderStyle = StyleSheet.create({
    default: {
      paddingRight: 15,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: 'grey',
    },
    overrides: {},
    debug: {},
  });

  const handle_Pick = (choice: any, index: number) => {
    logPress(`Picker Selection ${props.header}/${choice}`, '1620838279', 'btn', []);
    props.selectedState[1](choice);
  };

  return (
    <>
      <C.View style={[wrapperStyle.default, props.wrappingElementStyles, wrapperStyle.overrides, debug ? wrapperStyle.debug : undefined]}>
        <C.View style={{ flexDirection: 'row', paddingVertical: 10, display: props.header ? 'flex' : 'none' }}>
          <C.Text size="small" style={[headerStyle.default, props.headerStyles, headerStyle.overrides, debug ? headerStyle.debug : undefined]}>
            {props.header}
          </C.Text>
          <C.Text style={{ color: 'red', display: props.required ? 'flex' : 'none' }}>*</C.Text>
        </C.View>
        <C.View style={[borderStyle.default, props.borderStyles, borderStyle.overrides, debug ? borderStyle.debug : undefined]}>
          <C.Picker
            style={{ height: 44, marginLeft: 5, marginRight: -10 }}
            onValueChange={handle_Pick}
            selectedValue={props.selectedState[0]}
            textStyle={{ flex: 1, padding: 0 }}
            iosIcon={<C.Ionicon name={props.iconName || 'chevron-down-outline'} />}
            mode="dialog">
            {props.options.map((itm) => (
              <C.Picker.Item key={itm.key} label={itm.label} value={itm.key} />
            ))}
          </C.Picker>
        </C.View>
      </C.View>
    </>
  );
};
