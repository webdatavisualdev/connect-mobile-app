import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

// : Hooks
import H, { Routes, AllActions, iReduxState } from './../../../../Hooks';

// : Components
import C from './../../../../Components';

// : Misc
import M from './../../../../Misc';

import RouteNames from './../../../Routes';
import { MyLinks } from './myLinks';
import { QuickLinks } from './quickLinks';
import { StyleSheet } from 'react-native';

export const Links: React.FC = () => {
  const logPress = H.Logs.useLog_userPress({ source: 'links.tsx' });
  const nav = H.NPM.navigation.useNavigation();
  const LinksStack = createStackNavigator();
  const dispatch = H.NPM.redux.useDispatch();
  const showLinkEdit = H.NPM.redux.useSelector((s: iReduxState) => s.Main.showLinkEdit);
  const [editMode, setEditMode] = React.useState(false);

  const handle_EditMyLinks = () => {
    logPress('My Links Edit Mode Toggled', '1613427355', 'btn');
    setEditMode(!editMode);
    nav.navigate(Routes.linksMyLinks, { edit: !editMode });
    dispatch(AllActions.Main.handleSwipeNavigate({ value: editMode }));
  };

  const editMyLinks = () => {
    return (
      <C.View style={styles.headerLeft}>
        <C.Button transparent onPress={handle_EditMyLinks}>
          <C.Text style={styles.headerLeftText}>{editMode ? 'Done' : 'Edit'}</C.Text>
        </C.Button>
      </C.View>
    );
  };

  return (
    <>
      <LinksStack.Navigator
        screenOptions={{
          ...M.Tools.NavitationScreenOptions,
          headerLeft: showLinkEdit ? editMyLinks : undefined,
          title: 'Links',
        }}
        initialRouteName={RouteNames.links}>
        <LinksStack.Screen name={RouteNames.links} component={LinksTabs} />
      </LinksStack.Navigator>
    </>
  );
};

export const LinksTabs = () => {
  const LinksTabs = createMaterialTopTabNavigator();
  const dispatch = H.NPM.redux.useDispatch();

  return (
    <>
      <LinksTabs.Navigator
        screenOptions={{
          tabBarActiveTintColor: M.Colors.black,
          tabBarInactiveTintColor: M.Colors.doveGray,
          tabBarLabelStyle: styles.labelStyle,
          tabBarIndicatorStyle: styles.indicatorStyle,
        }}
        initialRouteName={RouteNames.linksQuickLinks}
      >
        <LinksTabs.Screen
          options={{ title: 'Quick Links' }}
          name={RouteNames.linksQuickLinks}
          component={QuickLinks}
          listeners={{
            tabPress: () => {
              dispatch(AllActions.Main.showLinkEditReducer({ value: false }));
            }
          }}
        />
        <LinksTabs.Screen
          options={{ title: 'My Links' }}
          name={RouteNames.linksMyLinks}
          component={MyLinks}
          listeners={{
            tabPress: () => {
              dispatch(AllActions.Main.showLinkEditReducer({ value: true }));
            }
          }}
        />
      </LinksTabs.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  labelStyle: {
    textTransform: 'none',
    fontSize: 16,
  },
  indicatorStyle: {
    backgroundColor: M.Colors.black,
    height: 2,
  },
  headerLeft: {
    paddingHorizontal: 15,
  },
  headerLeftText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: M.Colors.white,
  },
});
