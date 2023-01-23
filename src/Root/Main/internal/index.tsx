import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator, MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';
import { ParamListBase, useNavigation } from '@react-navigation/native';
// ! Requires editing file listed below in node modules...
// ! You can leave unmodified and typescript will default to any, even with ugly red squiggly...
// ! Missing Typescript types will not cause a compile error in my experience...
// ! cmd+p and paste: node_modules/@react-navigation/routers/lib/typescript/src/types.d.ts
// ! https://github.com/react-navigation/react-navigation/discussions/10042`
// ! Add "export" to line 3 typing `declare type NavigationRoute`
import { NavigationRoute } from '@react-navigation/routers';
import { StyleSheet } from 'react-native';

import RouteNames, { Routes } from './../../Routes';
import { DashboardStack } from './dashboard';
import { FeedStack } from './feed';
import { AlertsStack } from './alerts';
import { Links } from './links';
import { AppsStack } from './apps';

// : Hooks
import H, { iReduxState } from './../../../Hooks';

// : Components
import C from './../../../Components';

// : Misc
import M from './../../../Misc';
import Animated from 'react-native-reanimated';

const styles = StyleSheet.create({
  TabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: M.Colors.veniceBlue,
  },
  Tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    paddingBottom: 5,
  },
  TabLabel: {
    color: M.Colors.gray,
    fontFamily: 'Montserrat-Medium',
    opacity: 0.5,
    paddingTop: 3,
  },
  TabActiveLabel: {
    color: M.Colors.white,
    opacity: 1,
  },
});

export interface iCustomTabBarItemProps {
  index: number;
  TabBarProps: MaterialTopTabBarProps;
  CurrentRoute: NavigationRoute<ParamListBase, string>;
}

const CustomTabBarItem = (props: iCustomTabBarItemProps) => {
  const descriptors = props.CurrentRoute.key ? props.TabBarProps.descriptors[props.CurrentRoute.key] : props.CurrentRoute;
  const label = descriptors.options.tabBarLabel || descriptors.options.title || props.CurrentRoute.name;
  const isFocused = props.TabBarProps.state.index === props.index;
  const icon = descriptors.options.tabBarIcon ? (
    descriptors.options.tabBarIcon({
      focused: isFocused,
      color: isFocused ? M.Colors.white : M.Colors.gray,
    })
  ) : (
    <C.Icon name="question" />
  );

  const handle_onPress = () => {
    const event = props.TabBarProps.navigation.emit({
      type: 'tabPress',
      target: props.CurrentRoute.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      props.TabBarProps.navigation.navigate(props.CurrentRoute.name);
    }
  };
  return (
    <C.Pressable
      key={props.index}
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={descriptors.options.tabBarAccessibilityLabel}
      testID={descriptors.options.tabBarTestID}
      onPress={handle_onPress}
      style={[styles.Tab]}>
      {icon}
      <Animated.Text style={[styles.TabLabel, isFocused && styles.TabActiveLabel]}>{label}</Animated.Text>
    </C.Pressable>
  );
};

const CustomTabBar = (props: MaterialTopTabBarProps) => {
  const routes =
    props.state.routes.length > 1
      ? props.state.routes
      : [
          { name: RouteNames.feedStack, options: { tabBarIcon: (status: any) => <CustomIcon name="home" {...status} /> } },
          { name: RouteNames.alertsStack, options: { tabBarIcon: (status: any) => <CustomIcon name="notifications" {...status} /> } },
          { name: RouteNames.linksStack, options: { tabBarIcon: (status: any) => <CustomIcon name="heart" {...status} /> } },
          { name: RouteNames.appsStack, options: { tabBarIcon: (status: any) => <CustomIcon name="apps" {...status} /> } },
        ];
  const TabBarItems = routes.map((route: any, index) => {
    const key = props.state.routes.length > 1 ? index : route.key;
    return <CustomTabBarItem key={`CustomTabBar_${index}_${key}`} TabBarProps={props} CurrentRoute={route} index={index} />;
  });

  return <C.View style={styles.TabBar}>{TabBarItems}</C.View>;
};

export const InternalStack: React.FC = () => {
  const logPress = H.Logs.useLog_userPress({ source: 'src/Root/Main/internal/' });
  const nav = useNavigation();
  const InternalTabs = createMaterialTopTabNavigator();
  const swipeEnabled = H.NPM.redux.useSelector((s: iReduxState) => s.Main.swipeEnabled);
  const session = H.NPM.redux.useSelector((s: iReduxState) => s.Auth.activeSession);
  const feedTabLoaded = H.NPM.redux.useSelector((s: iReduxState) => s.Main.feedTabLoaded);
  const UserAlertsData = H.Queries.useQuery_AlertUserData();
  const [totalUserAlertsNumber, setTotalUserAlertsNumber] = React.useState(-1);

  React.useEffect(() => {
    console.log(UserAlertsData.data?.MyAlerts);
    let totalAlerts = 0;
    UserAlertsData.data?.MyAlerts.forEach((itm) => {
      const num = parseInt(itm.totalCount);
      totalAlerts += num;
    });
    // Enable this comment to force displaying the badge for testing purposes
    // totalAlerts += 1;
    setTotalUserAlertsNumber(totalAlerts);
  }, [UserAlertsData.updatedAt]);

  const dashExp = H.DEV.useExperiment<boolean>({
    key: 'WebViewDashboard',
    category: 'New Feature',
    name: 'Enable the WebView Dashboard Experience',
    description:
      'This Experiement will add a new element to the Bottom Nav Bar that will allow you to try out the Modern Sharepoint Dashboard experience (Or simply embedding any modern sharepoint site for quick access).  You can create a custom Modern Sharepoint page and customize it to how you like, and add it to the mobile app.',
    setting: false,
    defaultSetting: false,
  });

  return (
    <>
      <InternalTabs.Navigator
        tabBarPosition="bottom"
        initialRouteName={RouteNames.feedStack}
        backBehavior="initialRoute"
        screenOptions={{
          tabBarShowIcon: true,
          tabBarActiveTintColor: '#075080',
          tabBarInactiveTintColor: 'lightgrey',
          tabBarIndicatorStyle: { backgroundColor: '#075080' },
          swipeEnabled: swipeEnabled,
        }}
        tabBar={CustomTabBar}>
        {dashExp && dashExp.setting ? (
          <InternalTabs.Screen
            name={Routes.dashboardStack}
            options={{
              tabBarIcon: (status) => <CustomIcon name="rocket-outline" {...status} />,
              title: 'Dash',
              ...M.Tools.NavitationScreenOptions,
            }}
            component={DashboardStack}
          />
        ) : (
          <></>
        )}
        <InternalTabs.Screen
          name={RouteNames.feedStack}
          options={{ tabBarIcon: (status) => <CustomIcon name="home" {...status} />, title: 'NEWS' }}
          component={FeedStack}
        />
        {feedTabLoaded ? (
          <>
            <InternalTabs.Screen
              name={RouteNames.alertsStack}
              options={{
                tabBarIcon: (status) => <CustomIcon badge={totalUserAlertsNumber} name="notifications" {...status} />,
                title: 'ALERTS',
              }}
              component={AlertsStack}
            />
            {/* <InternalTabs.Screen name={RouteNames.talentMatch} component={TalentMatch} /> // TODO CleanUp Remove This and its related screens/code */}
            <InternalTabs.Screen
              name={RouteNames.linksStack}
              options={{ tabBarIcon: (status) => <CustomIcon name="heart" {...status} />, title: 'LINKS' }}
              component={Links}
            />
            <InternalTabs.Screen
              name={RouteNames.appsStack}
              options={{ tabBarIcon: (status) => <CustomIcon name="apps" {...status} />, title: 'APPS' }}
              component={AppsStack}
            />
          </>
        ) : (
          <></>
        )}
      </InternalTabs.Navigator>
      <C.Fab
        direction="up"
        containerStyle={{ marginBottom: 75, display: session ? 'flex' : 'none' }}
        style={{ backgroundColor: '#006298' }}
        position="bottomRight"
        onPress={() => {
          logPress('Chatbot_Open', '1625664726', 'fab');
          nav.navigate(RouteNames.chatbotStack);
        }}>
        <C.Svg.Svg
          height="60%"
          width="60%"
          viewBox="0 0 24 24"
          style={{ borderWidth: 0, borderColor: 'black', justifyContent: 'center', alignContent: 'center' }}>
          <C.Svg.Path
            fill="white"
            d="M15 4v7H5.17l-.59.59-.58.58V4h11m1-2H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm5 4h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1z"
          />
        </C.Svg.Svg>
      </C.Fab>
    </>
  );
};

export interface iCustomIconProps {
  name: string;
  focused: boolean;
  color: string;
  badge?: number;
}

const CustomIcon: React.FC<iCustomIconProps> = (props) => {
  return (
    <C.View style={{ borderWidth: 0 }}>
      <C.View
        style={{
          opacity: props.badge && props.badge > 0 ? 1 : 0,
          width: 10,
          height: 10,
          position: 'absolute',
          top: -5,
          right: -5,
          backgroundColor: 'red',
          borderRadius: 10,
          zIndex: 99,
        }}
      />
      <C.View style={{ opacity: props.focused ? 1 : 0.5 }}>
        <C.Ionicon size={24} name={props.name} color={props.color} />
      </C.View>
    </C.View>
  );
};
