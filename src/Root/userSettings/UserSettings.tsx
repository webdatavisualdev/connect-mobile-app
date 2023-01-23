import * as React from 'react';

// : Hooks
import H, { Routes } from './../../Hooks';

// : Components
import C from './../../Components';

import { Alert, StyleSheet } from 'react-native';

export const UserSettings: React.FC = () => {
  const logPress = H.Logs.useLog_userPress({ source: 'UserSettings.tsx' });
  const nav = H.NPM.navigation.useNavigation();
  const UserProfile = H.Queries.useQuery_UserProfile();
  const [user, setUser] = React.useState({
    name: '',
    department: '',
    phone: '',
    email: '',
  });

  const Experiment_ShowExtraButtons = H.DEV.useExperiment<boolean>({
    category: 'UserSettings',
    key: 'ShowExtraSettingsButtons',
    name: 'Reveal Extra Non-Functional Buttons',
    description: 'This will show several buttons that are ideas for various settings items, but are non-functional at the time of writing.',
    setting: false,
    defaultSetting: false,
  });

  React.useEffect(() => {
    if (UserProfile.error === null && UserProfile.data) {
      const u = UserProfile.data;
      setUser({
        ...user,
        name: u.DisplayName || user.name,
        department: u.Properties['Title'] || user.department,
        email: u.Email || user.email,
        phone: u.Properties['WorkPhone'] || user.phone,
      });
    }
  }, [UserProfile.data]);

  const handle_SignOut = () => {
    logPress('Sign out', '1619448785', 'btn');
    Alert.alert(
      'Sign Out?',
      'Are you sure you would like to sign out? This will close the application and the next time you come back you will have to login with your username and password again.',
      [
        {
          text: 'Cancel',
          onPress: () => {
            logPress('Canceled Sign Out', '1619448874', 'btn');
          },
        },
        {
          text: 'Confirm',
          onPress: () => {
            logPress('Confirmed Sign Out', '1619448893', 'btn');
            nav.navigate(Routes.authStack, { screen: Routes.authLogout });
          },
        },
      ],
    );
  };

  return (
    <>
      <C.Container style={styles.Root}>
        <C.Content contentContainerStyle={styles.Container}>
          <C.View style={styles.ProfileView}>
            <C.View style={styles.ProfilePictureWrap}>
              <C.View style={styles.ProfilePictureConstriction}>
                <C.ProfilePicture />
              </C.View>
            </C.View>
            <C.View style={styles.InformationWrap}>
              <C.Text size="medium" style={styles.TxtName}>
                {user.name}
              </C.Text>
              <C.Text style={styles.TxtDepartment}>{user.department}</C.Text>
            </C.View>
          </C.View>

          <C.View style={{ flex: 3 }}>
            <C.Card style={styles.ContactBox}>
              <C.CardItem style={styles.ContactContainer}>
                <C.Text style={styles.ContactDetailTitle}>Contact Details</C.Text>
                <C.Text style={styles.TxtPhone}>{user.phone}</C.Text>
                <C.Text style={styles.TxtEmail}>{user.email}</C.Text>
              </C.CardItem>
            </C.Card>

            <C.Card style={{ marginTop: 15, borderRadius: 5, overflow: 'hidden' }}>
              <C.Pressable onPress={() => nav.navigate(Routes.deviceInfo)} style={({ pressed }) => ({ backgroundColor: pressed ? '#81C342' : '#1CA9E1' })}>
                <C.CardItem style={{ flexDirection: 'column', alignItems: 'flex-start', backgroundColor: 'transparent' }}>
                  <C.Text style={{ color: 'white' }}>App/Device Information</C.Text>
                </C.CardItem>
              </C.Pressable>
            </C.Card>

            <C.Card style={{ marginTop: 15, borderRadius: 5, overflow: 'hidden' }}>
              <C.Pressable onPress={() => nav.navigate(Routes.legalContent)} style={({ pressed }) => ({ backgroundColor: pressed ? '#81C342' : '#1CA9E1' })}>
                <C.CardItem style={{ flexDirection: 'column', alignItems: 'flex-start', backgroundColor: 'transparent' }}>
                  <C.Text style={{ color: 'white' }}>Legal Information</C.Text>
                </C.CardItem>
              </C.Pressable>
            </C.Card>

            <C.Card style={{ marginTop: 15, borderRadius: 5, overflow: 'hidden' }}>
              <C.Pressable onPress={() => nav.navigate(Routes.dev)} style={({ pressed }) => ({ backgroundColor: pressed ? '#81C342' : '#1CA9E1' })}>
                <C.CardItem style={{ flexDirection: 'column', alignItems: 'flex-start', backgroundColor: 'transparent' }}>
                  <C.Text style={{ color: 'white' }}>Developer Menu</C.Text>
                </C.CardItem>
              </C.Pressable>
            </C.Card>

            <C.Card style={{ display: Experiment_ShowExtraButtons?.setting ? 'flex' : 'none', marginTop: 5, borderRadius: 5, overflow: 'hidden' }}>
              <C.Pressable style={({ pressed }) => ({ backgroundColor: pressed ? '#81C342' : '#1CA9E1' })}>
                <C.CardItem style={{ flexDirection: 'column', alignItems: 'flex-start', backgroundColor: 'transparent' }}>
                  <C.Text style={{ color: 'white' }}>NULL: Another Button</C.Text>
                </C.CardItem>
              </C.Pressable>
            </C.Card>

            <C.Card style={{ display: Experiment_ShowExtraButtons?.setting ? 'flex' : 'none', marginTop: 5, borderRadius: 5, overflow: 'hidden' }}>
              <C.Pressable style={({ pressed }) => ({ backgroundColor: pressed ? '#81C342' : '#1CA9E1' })}>
                <C.CardItem style={{ flexDirection: 'column', alignItems: 'flex-start', backgroundColor: 'transparent' }}>
                  <C.Text style={{ color: 'white' }}>IDEA: Covid-19 Vaccine Passport ?</C.Text>
                </C.CardItem>
              </C.Pressable>
            </C.Card>

            <C.Card style={{ display: Experiment_ShowExtraButtons?.setting ? 'flex' : 'none', marginTop: 5, borderRadius: 5, overflow: 'hidden' }}>
              <C.Pressable
                onPress={() => {
                  (globalThis as any).__DEV__ = !(globalThis as any).__DEV__;
                }}
                style={({ pressed }) => ({ backgroundColor: pressed ? '#81C342' : '#1CA9E1' })}>
                <C.CardItem style={{ flexDirection: 'column', alignItems: 'flex-start', backgroundColor: 'transparent' }}>
                  <C.Text style={{ color: 'white' }}>IDEA: Toggle Global Dev Mode</C.Text>
                </C.CardItem>
              </C.Pressable>
            </C.Card>

            <C.Card style={{ display: Experiment_ShowExtraButtons?.setting ? 'flex' : 'none', marginTop: 5, borderRadius: 5, overflow: 'hidden' }}>
              <C.Pressable style={({ pressed }) => ({ backgroundColor: pressed ? '#81C342' : '#1CA9E1' })}>
                <C.CardItem style={{ flexDirection: 'column', alignItems: 'flex-start', backgroundColor: 'transparent' }}>
                  <C.Text style={{ color: 'white' }}>IDEA: Change Password</C.Text>
                </C.CardItem>
              </C.Pressable>
            </C.Card>

            <C.Card style={styles.SignOutBox}>
              <C.Pressable onPress={handle_SignOut} style={{ backgroundColor: Colors.white }}>
                <C.CardItem style={styles.SignOutWrap}>
                  <C.Text style={styles.TxtSignOut}>Sign Out</C.Text>
                </C.CardItem>
              </C.Pressable>
            </C.Card>

            <C.Card transparent>
              <C.CardItem style={styles.Footer}>
                <C.Text style={styles.TextBase}>Copyright 2019, AdventHealth</C.Text>
                <C.Text style={[styles.TextBase, styles.TextSpaceVertical]}>Reserved Font Name Montserrat</C.Text>
                <C.Text style={[styles.TextBase, styles.TextSpaceVertical]}>App Version: 1.21.2</C.Text>
              </C.CardItem>
            </C.Card>
          </C.View>
        </C.Content>
      </C.Container>
    </>
  );
};

const Colors = {
  blueMain: '#2596be',
  gray: '#c8c8c8',
  lightGray: '#8B8B8C',
  white: '#ffffff',
};

const styles = StyleSheet.create({
  Root: {
    padding: 15,
    backgroundColor: '#f6f6f6',
  },
  Container: {
    flexDirection: 'column',
    height: '100%',
  },
  ProfileView: {
    flex: 1,
    flexDirection: 'row',
  },
  ProfilePictureWrap: {
    margin: 20,
    flex: 1,
    overflow: 'hidden',
    alignContent: 'center',
    justifyContent: 'center',
  },
  ProfilePictureConstriction: {
    aspectRatio: 1,
    borderRadius: 100,
    overflow: 'hidden',
  },
  InformationWrap: {
    flex: 3,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  TxtName: {
    fontFamily: 'Montserrat-Medium',
  },
  TxtDepartment: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 13,
  },
  ContactBox: {
    marginTop: 15,
    overflow: 'hidden',
  },
  ContactContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  ContactDetailTitle: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
  },
  TxtPhone: {
    paddingVertical: 2,
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
  },
  TxtEmail: {
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
  },
  SignOutBox: {
    marginTop: 15,
    overflow: 'hidden',
  },
  SignOutWrap: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  TxtSignOut: {
    fontSize: 24,
    color: 'black',
  },
  Footer: {
    flexDirection: 'column',
    backgroundColor: 'transparent',
  },
  TextBase: {
    fontSize: 14,
    color: 'grey',
  },
  TextSpaceVertical: {
    marginTop: 10,
  },
});
