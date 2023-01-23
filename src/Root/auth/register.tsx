import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import * as Keychain from 'react-native-keychain';
import { StyleSheet } from 'react-native';
import { SaveToKeychain } from '../../Misc/Tools/custom_Keychain';

// : Redux
import { useDispatch, useSelector } from 'react-redux';

// : Hooks
import H, { Routes, AllActions, iReduxState } from './../../Hooks';

// : Components
import C from './../../Components';
const companyLogo = require('./../../Assets/company_title_colored.png');
import M from './../../Misc';

export interface iProps {}

export const Register: React.FC = () => {
  const [debug, log, warn, error, tags, titles, legacyLog] = H.Logs.useLog({ source: 'register.tsx' });
  const dispatch = useDispatch();
  const nav = useNavigation();
  const [setBiometricsCache, delBiometricsCache, getBiometricsCache] = H.Misc.useAsyncStorage({ class: 'Auth', categories: ['Biometrics'] });
  const [setReturningUserCache, delReturningUserCache, getReturningUserCache, allReturningUserCache] = H.Misc.useAsyncStorage({
    class: 'Auth',
    categories: ['ReturningUser'],
  });

  // : Redux State
  const phase = useSelector((s: iReduxState) => s.Auth.phase);
  const tokens = useSelector((s: iReduxState) => s.Auth.tokens);
  const visualDebugging = useSelector((s: iReduxState) => s.Dev.visualDebugging);

  // : Local State
  const [pin, setPin] = React.useState<string>();
  const [useBiometrics, setUseBiometrics] = React.useState(false);
  const [biometricsType, setBiometricsType] = React.useState<null | Keychain.BIOMETRY_TYPE>();
  const [test, setTest] = React.useState('Nothing Yet');
  const [hidePassword, setHidePassword] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isValid, setIsValid] = React.useState(false);
  const [errorLength, setErrorLength] = React.useState(false);
  const [errorDelta, setErrorDelta] = React.useState(false);
  const [errorNotANumber, setErrorNotANumber] = React.useState(false);

  const checkBiometricSupport = async () => {
    const type = await Keychain.getSupportedBiometryType();
    setBiometricsType(type);
  };

  const handle_Toggle = () => setUseBiometrics((prevVal) => !prevVal);

  const handle_SavedPin = () => {
    nav.navigate(Routes.initialLoading);
  };

  const handle_SavePin = async () => {
    setIsLoading(true);
    if (useBiometrics && pin) {
      // Alert.alert('Saving Users pin under Biometry`')
      debug('Saving Pin to Keychain', '', { id: '1631054117' });
      SaveToKeychain({
        username: 'usersPin',
        encryptionKey: undefined,
        password: pin,
        KeychainOpt: {
          service: 'usersPin',
          accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
          accessible: Keychain.ACCESSIBLE.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY,
        },
      }).then((saved) => {
        if (saved) {
          setBiometricsCache([{ key: 'biometrics', value: '1' }]);
        }
      });
    }

    SaveToKeychain({
      username: 'sharepointUser',
      encryptionKey: pin,
      password: JSON.stringify(tokens),
      KeychainOpt: { service: 'secureAuthToken' },
    });

    setReturningUserCache([{ key: 'returningUser', value: '1' }]);
    dispatch(AllActions.Auth.setPhase({ phase: 'loggedIn' }));
    setIsLoading(false);
  };

  const get_SavedTokens = async () => {
    const opt: Keychain.Options = { service: 'secureAuthToken' };
    const secureStorageTokens = await Keychain.getGenericPassword(opt);
    setTest(secureStorageTokens ? secureStorageTokens.password : 'Nope');
  };

  React.useEffect(() => {
    if (phase === 'loggedIn') {
      handle_SavedPin();
    }
  }, [phase]);

  React.useEffect(() => {
    checkBiometricSupport();
    get_SavedTokens();
  });

  React.useEffect(() => {
    if (pin && pin.length > 0) {
      // : Identify non numerical values
      try {
        Number.parseInt(pin);
        setErrorNotANumber(false);
      } catch {
        setErrorNotANumber(true);
      }

      // : Identify a length less than 4 numbers long
      pin.length < 4 ? setErrorLength(true) : setErrorLength(false);

      // : Identify if the pin is four repeating digits (1111, 8888) or a sequence of numbers (1234, 6789)
      if (pin.length >= 4) {
        M.Tools.hasDelta(pin) ? setErrorDelta(true) : setErrorDelta(false);
      } else {
        setErrorDelta(false);
      }
    } else {
      setIsValid(false);
      setErrorLength(false);
      setErrorNotANumber(false);
      setErrorDelta(false);
    }
  }, [pin]);

  React.useEffect(() => {
    if (pin && pin.length > 0 && !errorNotANumber && !errorLength && !errorDelta) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [pin, errorNotANumber, errorLength, errorDelta]);

  const trackColorOn = C.RNPlatform.OS === 'android' ? 'transparent' : M.Colors.blueMain;
  const trackColorOff = C.RNPlatform.OS === 'android' ? 'transparent' : M.Colors.gray;
  const androidContainerStyle = C.RNPlatform.OS === 'android' ? { backgroundColor: useBiometrics ? M.Colors.blueMain : M.Colors.gray } : {};

  return (
    <C.SafeAreaView style={styles.AreaViewContainer}>
      <C.KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={C.RNPlatform.OS == 'ios' ? 0 : -300} style={styles.Container}>
        <C.Pressable onPress={C.RNKeyboard.dismiss} style={styles.PressableContainer}>
          <C.View style={styles.Root}>
            <C.View style={{ display: visualDebugging ? 'flex' : 'none' }}>
              <C.Text>isValid : {isValid ? 'T' : 'F'}</C.Text>
            </C.View>
            <C.ScrollView showsVerticalScrollIndicator={false}>
              <C.View style={styles.ImageContainer}>
                <C.RNImage style={styles.LogoImage} source={companyLogo} />
              </C.View>
              <C.View>
                <C.Text style={styles.PinLabel}>Please create a 4-digit PIN for easy access.</C.Text>
              </C.View>
              <C.View style={styles.PinInputContainer}>
                <C.Input
                  style={styles.PinInput}
                  keyboardType="numeric"
                  textContentType="password"
                  secureTextEntry={hidePassword ? true : false}
                  onChange={(e) => setPin(e.nativeEvent.text)}></C.Input>
                <C.Icon style={styles.Icon} name={hidePassword ? 'eye-off' : 'eye'} onPress={() => setHidePassword(!hidePassword)} />
              </C.View>
              <C.List style={styles.errorList}>
                <C.ListItem style={{ display: errorLength ? 'flex' : 'none' }}>
                  <C.Text style={[styles.errorText]}>Please make your pin at least 4 digits long</C.Text>
                </C.ListItem>

                <C.ListItem style={{ display: errorDelta ? 'flex' : 'none' }}>
                  <C.Text style={[styles.errorText]}>Sequences or Repeating values detected, please do not use these kinds of values</C.Text>
                </C.ListItem>

                <C.ListItem style={{ display: errorNotANumber ? 'flex' : 'none' }}>
                  <C.Text style={[styles.errorText]}>Pin is not a number, please only use numerical values</C.Text>
                </C.ListItem>
              </C.List>
              <C.View>
                <C.Text style={styles.BaseText}>PIN can't be a common number pattern (e.g., 1111 or 1234).</C.Text>
              </C.View>
              <C.View style={{ ...styles.BiometricsToggleContainer, display: biometricsType ? 'flex' : 'none' }}>
                <C.View>
                  <C.Text style={styles.BaseText}>Authenticate next time using</C.Text>
                  <C.Text style={styles.InnerText}>{`${biometricsType}`}</C.Text>
                </C.View>
                <C.View style={[styles.SwitchToggle, androidContainerStyle]}>
                  <C.Switch
                    trackColor={{ false: trackColorOff, true: trackColorOn }}
                    thumbColor={M.Colors.white}
                    style={C.RNPlatform.OS === 'android' ? styles.Switch : {}}
                    value={useBiometrics}
                    onValueChange={handle_Toggle}
                    ios_backgroundColor={trackColorOff}
                  />
                </C.View>
              </C.View>
              <C.Button
                style={[styles.BtnEnter, isValid ? styles.BtnEnterActive : {}]}
                onPress={handle_SavePin}
                disabled={isLoading === true || isValid === false}>
                <C.Text style={styles.TextEnter}>Enter</C.Text>
                {isLoading ? <C.Spinner color="white" /> : <></>}
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
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: M.Colors.alto,
    padding: 10,
  },
  PinInput: {
    flex: 1,
    fontFamily: 'Montserrat-Light',
  },
  BiometricsToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    paddingTop: 20,
  },
  ImageContainer: {
    height: 120,
    alignItems: 'center',
    paddingTop: 20,
  },
  BtnEnter: {
    width: '100%',
    height: 60,
    backgroundColor: M.Colors.gray,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    elevation: 3,
    marginBottom: 10,
    marginTop: 35,
  },
  TextEnter: {
    fontSize: 18,
    lineHeight: 32,
    letterSpacing: 0.25,
    color: M.Colors.white,
    fontFamily: 'Montserrat-Medium',
  },
  PinLabel: {
    color: M.Colors.black,
    fontFamily: 'Montserrat-Light',
    fontSize: 18,
  },
  Root: {
    flex: 1,
    marginLeft: 20,
    marginRight: 20,
  },
  BaseText: {
    color: M.Colors.black,
    fontFamily: 'Montserrat-Light',
    fontSize: 14,
  },
  InnerText: {
    color: 'dodgerblue',
    fontFamily: 'Montserrat-Bold',
  },
  Container: {
    flex: 1,
  },
  Icon: {
    color: M.Colors.capeCod,
    fontSize: 40,
  },
  LogoImage: {
    width: 180,
    height: 45,
  },
  SwitchToggle: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    height: 30,
    paddingHorizontal: 3,
  },
  Switch: {
    transform: [{ scaleX: 1.22 }, { scaleY: 1.22 }],
  },
  BtnEnterActive: {
    backgroundColor: M.Colors.blueMain,
  },
  AreaViewContainer: {
    flex: 1,
    backgroundColor: M.Colors.white,
  },
  PressableContainer: {
    flex: 1,
  },
  errorList: {
    paddingVertical: 5,
  },
  errorText: {
    fontSize: 14,
    color: 'red',
  },
});
