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
  placeholder: string;
  selectedState: any;
  options: iOption[];
  showGroupings?: boolean;
}

export interface iOption {
  grouping?: string;
  key: string;
  label: string;
}

export const MultiPicker: React.FC<iProps> = (props) => {
  const logPress = H.Logs.useLog_userPress({ source: 'Components/MultiPicker' });
  const debug = H.NPM.redux.useSelector((s: iReduxState) => s.Dev.visualDebugging);
  const [showModal, setShowModal] = React.useState(false);

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
      padding: 15,
      paddingVertical: 10,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: 'grey',
      fontSize: 16.5,
      fontFamily: 'System',
    },
    overrides: {},
    debug: {},
  });

  const selectedStyle = StyleSheet.create({
    base: {
      borderRadius: 5,
      margin: 4,
      borderWidth: 1,
      padding: 4,
      alignSelf: 'center',
    },
    selected: {
      backgroundColor: '#81C342',
    },
    deselected: {
      backgroundColor: '#C1C6C8',
    },
  });

  const extractGroups = (): string[] => {
    const onlyGroups = props.options.map((i) => (i.grouping ? i.grouping : ''));
    return [...new Set(onlyGroups)];
  };

  const allIsSelected = (grouping: string) => {
    const eachResult: boolean[] = [];
    props.options.forEach((i) => {
      if (i.grouping === grouping) {
        if (isSelected(i.key)) {
          eachResult.push(true);
        } else {
          eachResult.push(false);
        }
      }
    });
    return eachResult.indexOf(false) === -1;
  };

  const isSelected = (value: string) => {
    return props.selectedState[0].indexOf(value) > -1 ? true : false;
  };

  const handle_showModal = () => {
    logPress(`Toggle MultiPicker ${props.header || '(Label Not found)'} Modal ${showModal ? 'Close' : 'Open'}`, '1620323429', 'btn', []);
    setShowModal(!showModal);
  };

  const handle_toggleItem = (item: any) => {
    const state = props.selectedState[0];
    const setState = props.selectedState[1];
    if (state.indexOf(item) > -1) {
      logPress(`User De-Selected MultiPicker Item ${props.header}/${item}`, '1620838620', 'btn', []);
      state.splice(state.indexOf(item), 1);
      setState([...state]);
    } else {
      logPress(`User Selected MultiPicker Item ${props.header}/${item}`, '1620838696', 'btn', []);
      setState([...state, item]);
    }
  };

  const handle_toggleGroup = (grouping: string) => {
    const newState = [...props.selectedState[0]];
    if (allIsSelected(grouping)) {
      // toggle them off
      logPress(`User De-Selected MultiPicker Group ${props.header}/${grouping}`, '1620838738', 'btn', []);
      props.options.forEach((i) => {
        if (i.grouping === grouping && newState.indexOf(i.key) > -1) {
          newState.splice(newState.indexOf(i.key), 1);
        }
      });
    } else {
      // toggle them on
      logPress(`User Selected MultiPicker Group ${props.header}/${grouping}`, '1620838748', 'btn', []);
      props.options.forEach((i) => {
        if (i.grouping === grouping) {
          newState.push(i.key);
        }
      });
    }

    props.selectedState[1]([...new Set(newState)]);
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
        <C.Pressable onPress={handle_showModal}>
          <C.View style={[borderStyle.default, props.borderStyles, borderStyle.overrides, debug ? borderStyle.debug : undefined]}>
            <C.View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <C.Text style={{ flex: 1, textAlignVertical: 'center', fontSize: 16.5, fontFamily: 'System' }}>{props.placeholder}</C.Text>
              <C.Ionicon style={{ fontSize: 22 }} name="chevron-forward-outline" />
            </C.View>
          </C.View>
        </C.Pressable>
      </C.View>

      <C.Modal visible={showModal}>
        <C.Header hasTabs={props.showGroupings}>
          <C.Left>
            <C.Button onPress={handle_showModal} transparent>
              <C.Text>Done</C.Text>
            </C.Button>
          </C.Left>
          <C.Body>
            <C.Text>{props.header}</C.Text>
          </C.Body>
          <C.Right></C.Right>
        </C.Header>
        <C.Tabs initialPage={1} tabContainerStyle={{ display: props.showGroupings ? 'flex' : 'none' }} locked={!props.showGroupings}>
          <C.Tab heading="Groups">
            <C.Container style={{ backgroundColor: '#f6f6f6' }}>
              <C.Content>
                <C.Body style={{ padding: 15 }}>
                  <C.Card style={{ display: debug ? 'flex' : 'none' }}>
                    <C.CardItem>
                      <C.Text>{props.selectedState[0].join(', ')}</C.Text>
                    </C.CardItem>
                  </C.Card>
                  <C.Card style={{ flexDirection: 'row', flexWrap: 'wrap', padding: 15 }}>
                    {extractGroups().map((itm) => (
                      <>
                        <C.Pressable key={itm} onPress={() => handle_toggleGroup(itm)}>
                          <C.View style={[selectedStyle.base, allIsSelected(itm) ? selectedStyle.selected : selectedStyle.deselected]}>
                            <C.Text style={{ color: 'white', fontWeight: '500' }}>{itm}</C.Text>
                          </C.View>
                        </C.Pressable>
                      </>
                    ))}
                  </C.Card>
                </C.Body>
              </C.Content>
            </C.Container>
          </C.Tab>

          <C.Tab heading={'Choices'}>
            <C.Container style={{ backgroundColor: '#f6f6f6' }}>
              <C.Content>
                <C.Content>
                  <C.Body style={{ padding: 15 }}>
                    <C.Card style={{ display: debug ? 'flex' : 'none' }}>
                      <C.CardItem>
                        <C.Text>{props.selectedState[0].join(', ')}</C.Text>
                      </C.CardItem>
                    </C.Card>
                    <C.Card style={{ flexDirection: 'row', flexWrap: 'wrap', padding: 15 }}>
                      {props.options.map((itm) => (
                        <>
                          <C.Pressable key={itm.key} onPress={() => handle_toggleItem(itm.key)}>
                            <C.View style={[selectedStyle.base, isSelected(itm.key) ? selectedStyle.selected : selectedStyle.deselected]}>
                              <C.Text style={{ color: 'white', fontWeight: '500' }}>
                                {itm.label} {debug ? `(${itm.key})` : ''}
                              </C.Text>
                            </C.View>
                          </C.Pressable>
                        </>
                      ))}
                    </C.Card>
                  </C.Body>
                </C.Content>
              </C.Content>
            </C.Container>
          </C.Tab>
        </C.Tabs>
      </C.Modal>
    </>
  );
};
