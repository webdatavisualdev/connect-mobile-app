import * as React from 'react';
import { StyleSheet } from 'react-native';

// : Hooks
import H, { Routes, RoutesHierarchy } from './../../Hooks';

// : Components
import C from './../../Components';

export const NavMaster: React.FC = () => {
  const nav = H.NPM.navigation.useNavigation();

  const styles = StyleSheet.create({
    navButton: {
      margin: 10,
      padding: 10,
    },
    labelWrapper: {
      display: 'flex',
      flexGrow: 1,
      flexDirection: 'column',
      justifyContent: 'flex-start',
    },
    labelTitle: {
      color: 'white',
    },
    labelDescription: {
      color: 'white',
      fontSize: 12,
    },
  });

  const L = (props: { l: string; s?: string }) => (
    <C.View style={styles.labelWrapper}>
      <C.Text style={styles.labelTitle}>{props.l}</C.Text>
      <C.Text style={styles.labelDescription}>{props.s}</C.Text>
    </C.View>
  );

  interface iRoutesHierarchyItem {
    route: string;
    type: 'stack' | 'modal' | 'screen';
    routes?: iRoutesHierarchyItem[];
    params?: iParams[];
    navObject: [string, object];
    disableDirectNav?: boolean;
  }

  interface iParams {
    optional: boolean;
    key: string;
    type: string;
    sample: any;
  }

  const RenderItem = (props: iRoutesHierarchyItem) => {
    switch (props.type) {
      case 'stack':
        return <RenderStack {...props} />;
      case 'screen':
        return <RenderScreen {...props} />;
      case 'modal':
        return <RenderScreen {...props} />;
      default:
        return <C.Text>Route Type not Accounted For</C.Text>;
    }
  };

  const RenderStack = (props: iRoutesHierarchyItem) => {
    if (props.routes) {
      return (
        <C.View style={{ padding: 5, margin: 5, borderWidth: 1 }}>
          <C.Text>STACK: {props.route}</C.Text>
          {props.routes.map((i) => (
            <>
              <RenderItem {...i} />
            </>
          ))}
        </C.View>
      );
    } else {
      return <C.Text>This stack has no routes defined</C.Text>;
    }
  };

  const RenderScreen = (props: iRoutesHierarchyItem) => {
    return (
      <C.View>
        <C.Button
          block
          disabled={props.disableDirectNav === true}
          style={styles.navButton}
          onPress={() => {
            nav.navigate(props.navObject[0], props.navObject[1]);
          }}>
          <L l={`${props.type} : ${props.route}`} s="" />
        </C.Button>
      </C.View>
    );
  };

  return (
    <C.Container>
      <C.FlatList data={RoutesHierarchy} keyExtractor={(i, index) => `navMaster-${index}`} renderItem={(i) => <RenderItem {...i.item} />} />
    </C.Container>
  );
};
