import * as React from 'react';
import { useNavigation } from '@react-navigation/native';

import Routes from './../Routes';

// : Redux
import { useDispatch } from 'react-redux';
import Actions from './../../Redux/AllActions';
import iReduxState from './../../Redux/iReduxState';

// : Components
import C from './../../Components';
import { useSelector } from 'react-redux';

const logo = require('./../../Assets/logo.png');

export interface iProps {}

export const Auth: React.FC<iProps> = (props) => {
  const nav = useNavigation();
  const dispatch = useDispatch();
  const phase = useSelector((state: iReduxState) => state.Auth.phase);

  React.useEffect(() => {
    dispatch(Actions.Auth.setPhase({ phase: 'secureAuth' }));
    nav.setOptions({ 
      headerLeft: backButton,
      headerBackground: () => <C.RNImage source={logo} style={{resizeMode: 'contain', flex: 0.5}} />,
      title: '',
    });
  }, []);

  React.useEffect(() => {
    if (phase === 'configure') nav.navigate(Routes.authRegister);
  }, [phase]);

  const backButton = () => (
    <>
      <C.Button transparent onPress={() => nav.goBack()}>
        <C.Text style={{color: 'white'}}>Back</C.Text>
      </C.Button>
    </>
  );

  const loginUrl =
    'https://login.adventhealth.com/secureauth140/SecureAuth.aspx?response_type=code&scope=openid%20profile%20email%20offline_access&client_id=964140fea1e642449e048e21744346a0&nonce=ahstest&redirect_uri=ahsemp%3A%2F%2Fmain';
  return (
    <>
      <C.WebView sharedCookiesEnabled={true} thirdPartyCookiesEnabled={true} source={{ uri: loginUrl }} />
    </>
  );
};
