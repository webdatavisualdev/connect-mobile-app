import * as React from 'react';
import { StyleSheet } from 'react-native';
import * as CustKeychain from './../../Misc/Tools/custom_Keychain';
import Keychain from 'react-native-keychain';
import { useNavigation } from '@react-navigation/native';
import RouteNames from './../Routes';
import RefreshTokens from './../../Misc/Network/Auth/fetchTokensRefresh';

const companyLogo = require('./../../Assets/company_title_colored.png');

// : Hooks
import H, { Routes, AllActions } from './../../Hooks';

// : Components
import C from './../../Components';

// : Misc
import M, { iTokens } from './../../Misc';

export interface iProps {}

const Colors = {
  blueMain: '#2596be',
  gray: '#c8c8c8',
  lightGray: '#8B8B8C',
  white: '#ffffff',
  Alto: '#CECECE',
  CapeCod: '#3B3F42',
};

export const PinEntry: React.FC = () => {
  const isFocused = H.Misc.useScreenMount(Routes.authPin, { title: 'Auth Pin' });
  const [debug, log, warn, error, tags, titles, legacyLog] = H.Logs.useLog({ source: 'pinEntry.tsx' });
  const [setBiometricsCache, delBiometricsCache, getBiometricsCache, allBiometricsCache] = H.Misc.useAsyncStorage({
    class: 'Auth',
    categories: ['Biometrics'],
  });
  const [biometricsEnabled, setBiometricsEnabled] = React.useState(false);
  const dispatch = H.NPM.redux.useDispatch();
  const nav = useNavigation();
  const [pin, setPin] = React.useState('');
  const [hidePassword, setHidePassword] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    getBiometricsCache(['biometrics']).then((biometricsDetected) => {
      if (biometricsDetected[0][1]) {
        CustKeychain.GetFromKeychain({
          KeychainOpt: {
            service: 'usersPin',
            accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
            accessible: Keychain.ACCESSIBLE.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY,
          },
        }).then((val) => {
          try {
            let pin = '';

            if (typeof val === 'string') {
              const tmp = JSON.parse(val) as any;
              pin = tmp.password;
            } else {
              pin = val.password;
            }

            if (pin !== '') {
              setPin(pin);
            } else {
              // TODO Throw an Error, the pin was corrupt or not present
            }
            debug('Results from GetFromKeychain', JSON.stringify(val), { id: '1631049845' });
          } catch (err) {
            error('There was an error retreiving and parsing the users pin', `${err}`, { id: '1634830806' });
          }
        });
      }
    });
  }, []);

  React.useEffect(() => {
    if (isFocused) {
      dispatch(AllActions.Main.pinScreenFocusedReducer({ value: true }));
    }
  }, [isFocused]);

  React.useEffect(() => {
    getBiometricsCache(['biometrics']).then((val) => {
      if (val[0][1] && val[0][1] === '1') {
        setBiometricsEnabled(true);
      } else {
        setBiometricsEnabled(false);
      }
    });
  }, []);

  React.useEffect(() => {
    if (pin.length >= 4 && biometricsEnabled) {
      handle_Login();
    }
  }, [pin.length, biometricsEnabled]);

  const handle_Login = async () => {
    setIsLoading(true);
    const keychainValue = await CustKeychain.GetFromKeychain({
      encryptionKey: pin,
      KeychainOpt: { service: 'secureAuthToken' },
    });

    if (typeof keychainValue === 'string') {
      try {
        let tokens: iTokens = JSON.parse(keychainValue);

        if (tokens.expires_at && parseInt(tokens.expires_at) < Date.now()) {
          const refreshedTokens = await RefreshTokens(tokens.refresh_token);
          tokens = refreshedTokens;
        }

        if (tokens.error) {
          handleLogout();
        } else {
          dispatch(AllActions.Auth.handleTokens({ tokens: tokens }));
          dispatch(AllActions.Auth.setPhase({ phase: 'loggedIn' }));
          setIsLoading(false);
          nav.navigate(Routes.internalContent, { screen: Routes.feedStack, params: { screen: Routes.feed } });
        }
      } catch {
        // * Note: We are not saving these values back to the keystore;
        // * That means these tokens are only good for their lifespan, they are not being renewed indefinitely
        // TODO Refresh Tokens threw an error and rejected; unable to refresh tokens, have user retry or re-login
        handleLogout();
      }
    } else {
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    C.Alert.alert('Token Invalid', 'Looks like it’s been 90 days since you’ve last logged in. For security reasons, please login to continue.');
    nav.navigate(Routes.authLogout);
  };

  return (
    <C.SafeAreaView style={styles.AreaViewContainer}>
      <C.KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={C.RNPlatform.OS == 'ios' ? 0 : -300} style={styles.Container}>
        <C.Pressable onPress={C.RNKeyboard.dismiss} style={styles.PressableContainer}>
          <C.View style={styles.Root}>
            <C.ScrollView showsVerticalScrollIndicator={false}>
              <C.View style={styles.ImageContainer}>
                <C.RNImage style={styles.LogoImage} source={companyLogo} />
              </C.View>
              <C.View>
                <C.Text style={styles.PinLabel}>To unlock the app enter your PIN below.</C.Text>
              </C.View>
              <C.KeyboardAvoidingView style={styles.PinInputContainer}>
                <C.Input
                  style={styles.PinInput}
                  keyboardType="numeric"
                  textContentType="password"
                  secureTextEntry={hidePassword ? true : false}
                  onChange={(e) => setPin(e.nativeEvent.text)}></C.Input>
                <C.Icon style={styles.Icon} name={hidePassword ? 'eye-off' : 'eye'} onPress={() => setHidePassword(!hidePassword)} />
              </C.KeyboardAvoidingView>
              <C.Button style={[styles.BtnUnlock, pin && pin.length ? styles.BtnUnlockActive : {}]} onPress={handle_Login} disabled={isLoading}>
                <C.Text style={styles.TextUnlock}>Unlock</C.Text>
                {isLoading ? <C.Spinner color="white" /> : <></>}
              </C.Button>
              <C.Button style={styles.BtnLogOut} onPress={() => nav.navigate(RouteNames.authLogout)} transparent>
                <C.Text style={styles.TextLogOut}>Log out to reset your PIN</C.Text>
              </C.Button>
            </C.ScrollView>
          </C.View>
        </C.Pressable>
      </C.KeyboardAvoidingView>
    </C.SafeAreaView>
  );
};

const styles = StyleSheet.create({
  PinInputContainer: {
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 70,
    marginTop: 32,
    marginBottom: 40,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: Colors.Alto,
    padding: 10,
  },
  PinInput: {
    flex: 1,
    fontFamily: 'Montserrat-Light',
  },
  BiometricsToggleContainer: {
    flexShrink: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
  },
  ImageContainer: {
    height: 120,
    alignItems: 'center',
    paddingTop: 20,
  },
  BtnUnlock: {
    width: '100%',
    height: 60,
    backgroundColor: Colors.gray,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    elevation: 3,
  },
  BtnUnlockActive: {
    backgroundColor: Colors.blueMain,
  },
  TextUnlock: {
    fontSize: 18,
    lineHeight: 32,
    letterSpacing: 0.25,
    color: Colors.white,
    fontFamily: 'Montserrat-Medium',
  },
  PinLabel: {
    fontSize: 18,
    color: M.Colors.black,
    fontFamily: 'Montserrat-Light',
  },
  Root: {
    flex: 1,
    marginLeft: 20,
    marginRight: 20,
  },
  BtnLogOut: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  TextLogOut: {
    fontSize: 15,
    fontFamily: 'Montserrat-Medium',
  },
  Container: {
    flex: 1,
  },
  Icon: {
    color: Colors.CapeCod,
    fontSize: 40,
  },
  LogoImage: {
    width: 180,
    height: 45,
  },
  AreaViewContainer: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  PressableContainer: {
    flex: 1,
  },
});
