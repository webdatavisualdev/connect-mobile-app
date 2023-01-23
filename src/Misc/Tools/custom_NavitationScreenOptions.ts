import { StackNavigationOptions } from '@react-navigation/stack';
import { Platform } from 'react-native';
import Colors from '../Colors';

export const NavitationScreenOptions: StackNavigationOptions = { 
  animationEnabled: Platform.select({ android: false, ios: true }),
  headerStyle: {
    backgroundColor: Colors.veniceBlue,
    elevation: 0,
    shadowOpacity: 0,
  },
  headerTitleStyle: {
    color: Colors.white,
  },
  headerBackTitleStyle: {
    color: Colors.white,
  },
  headerBackgroundContainerStyle: {
    backgroundColor: Colors.veniceBlue,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 10,
  },
};
