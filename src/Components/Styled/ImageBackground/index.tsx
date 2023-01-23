import * as React from 'react';
import { StyleSheet, ImageBackgroundProps, ImageURISource } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';

// : Components
import { ImageBackground as RNImageBackground } from 'react-native';
import { Spinner } from 'native-base';
import Text from './../Text';
import View from './../View';

// : Hooks
import H, { iReduxState } from './../../../Hooks';
import AsyncStorage from '@react-native-community/async-storage';

export interface iProps extends ImageBackgroundProps {
  children?: JSX.Element | JSX.Element[];
  PlaceHolder?: string;
  WaitForAuth?: boolean;
  source: ImageURISource;
}

export const ImageBackground: React.FC<iProps> = (props) => {
  const debug = H.NPM.redux.useSelector((s: iReduxState) => s.Dev.visualDebugging);
  const session = H.NPM.redux.useSelector((s: iReduxState) => s.Auth.activeSession);
  const [doneCheckingCache, setDoneCheckingCache] = React.useState(false);
  const [cacheFound, setCacheFound] = React.useState(false);
  const [base64Image, setBase64Image] = React.useState<ImageURISource>({});

  const builtInStyle = StyleSheet.create({
    default: {
      padding: 0,
      flex: 1,
    },
    overrides: {},
    debug: {
      borderWidth: 1,
      backgroundColor: 'salmon',
    },
  });

  if (props.PlaceHolder) {
    return (
      <View
        style={{
          flexShrink: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 15,
          backgroundColor: 'salmon',
        }}>
        <Text
          style={{
            borderWidth: 10,
            borderColor: 'red',
            color: 'lime',
          }}>
          {props.PlaceHolder}
        </Text>
      </View>
    );
  }

  // Use Image from Cache
  React.useEffect(() => {
    if (props.source.uri)
      AsyncStorage.getItem(props.source.uri).then((img) => {
        if (img) {
          setBase64Image({ uri: img });
          setCacheFound(true);
        }
        setDoneCheckingCache(true);
      });
  }, [props.source]);

  const evalWaitForAuth = (uri: string) => {
    if (uri.indexOf('ahsonline.sharepoint.com') > 0) {
      // URI is behind auth, should wait for auth before proceeding
      return session;
    } else {
      // URI is public, just get it, return true right away
      return true;
    }
  };

  React.useEffect(() => {
    if (typeof props.source !== 'number' && (props.source as any).uri && evalWaitForAuth((props.source as any).uri) && doneCheckingCache && !cacheFound) {
      RNFetchBlob.fetch('GET', (props.source as any).uri)
        .then((response) => {
          let base64 = response.base64();
          const str = 'data:image/jpg;base64,' + base64;

          AsyncStorage.setItem((props.source as any).uri, str);
          setBase64Image({ uri: str });
        })
        .catch((err) => {
          console.error('There was an error fetching the image', err);
        });
    }
  }, [props.source, session]);

  if (base64Image.uri === undefined) {
    return <Spinner color="grey" />;
  }

  return (
    <RNImageBackground
      {...props}
      source={base64Image ? base64Image : { uri: 'https://placeimg.com/150/150' }}
      style={[builtInStyle.default, props.style, builtInStyle.overrides, debug ? builtInStyle.debug : undefined]}>
      {props.children}
    </RNImageBackground>
  );
};
