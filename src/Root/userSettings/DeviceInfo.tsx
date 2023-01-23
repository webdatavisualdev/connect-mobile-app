import * as React from 'react';
import DeviceInfo from 'react-native-device-info';
import Clipboard from '@react-native-clipboard/clipboard';

// : Hooks
import H, { Routes } from './../../Hooks';

// : Components
import C from './../../Components';

export interface iProps {}

export const AppAndDeviceInfo: React.FC<iProps> = () => {
  const isFocused = H.Misc.useScreenMount(Routes.deviceInfo, { title: 'Device Info' });
  const nav = H.NPM.navigation.useNavigation();
  const FirebaseAuth = H.Firebase.useAuth();

  return (
    <C.Container style={{ backgroundColor: '#f6f6f6' }}>
      <C.Content style={{ padding: 15 }}>
        <C.Card style={{ flex: 1 }}>
          <C.CardItem header>
            <C.Text style={{ fontWeight: 'bold' }}>Application Details</C.Text>
          </C.CardItem>
          <C.CardItem>
            <C.Body>
              <ViewRecord title="App Name" value={DeviceInfo.getApplicationName()} />
              <ViewRecord title="Bundle ID" value={DeviceInfo.getBundleId()} />
              <ViewRecord title="App Version" value={DeviceInfo.getReadableVersion()} />

              <ViewRecord title="Release Notes" value="Click to Expand" component={<C.ReleaseNotes />} />
              <ViewRecord title="Screen Security" value="Enabled/Disabled, need to allow toggling this Android Feature" />
            </C.Body>
          </C.CardItem>
        </C.Card>

        <C.Card>
          <C.CardItem header>
            <C.Text style={{ fontWeight: 'bold' }}>Device Details</C.Text>
          </C.CardItem>
          <C.CardItem>
            <C.Body>
              <ViewRecord title="Device Name" value={__DEV__ !== undefined ? 'Not Available in Development' : DeviceInfo.getDeviceNameSync()} />
              <ViewRecord
                title="Device"
                value={__DEV__ !== undefined ? 'Not Available in Development' : DeviceInfo.getManufacturerSync() + ' ' + DeviceInfo.getModel()}
              />
            </C.Body>
          </C.CardItem>
        </C.Card>

        <C.Card>
          <C.CardItem header>
            <C.Text style={{ fontWeight: 'bold' }}>Firebase Details</C.Text>
          </C.CardItem>
          <C.CardItem>
            <C.Body>
              <ViewRecord title="Account UID" value={FirebaseAuth?.uid || 'Not Found'} />
            </C.Body>
          </C.CardItem>
        </C.Card>

        <C.Card>
          <C.CardItem header>
            <C.Text style={{ fontWeight: 'bold' }}>Sharepoint Details</C.Text>
          </C.CardItem>
          <C.CardItem>
            <C.Body>
              <ViewRecord title="Account UID" value="TO BE ADDED" />
            </C.Body>
          </C.CardItem>
        </C.Card>
      </C.Content>
    </C.Container>
  );
};

export interface iProps {
  title: string;
  value: string;
  component?: JSX.Element;
}

export const ViewRecord: React.FC<iProps> = (props) => {
  const [modal, setModal] = React.useState(false);

  const handle_Press = () => {
    if (props.component) {
      setModal(!modal);
    } else {
      C.Alert.alert(props.title, props.value, [
        {
          text: 'Copy',
          style: 'default',
          onPress: () => {
            Clipboard.setString(props.value);
          },
        },
        {
          text: 'Close',
          style: 'cancel',
          onPress: () => {},
        },
      ]);
    }
  };

  return (
    <C.Pressable onPress={handle_Press}>
      <C.View style={{ marginVertical: 5, flexDirection: 'column' }}>
        <C.Text size="small" style={{}}>
          {props.title}
        </C.Text>
        <C.Text size="tiny" style={{ color: 'grey' }}>
          {props.value}
        </C.Text>
        <C.Modal visible={modal}>
          <C.Header>
            <C.Left style={{ flex: 3 }}>
              <C.Pressable onPress={handle_Press}>
                <C.Text>Back</C.Text>
              </C.Pressable>
            </C.Left>
            <C.Body style={{ flex: 7 }}>
              <C.Text>Expanded Record</C.Text>
            </C.Body>
            <C.Right style={{ flex: 3 }} />
          </C.Header>
          <C.ScrollView>{props.component}</C.ScrollView>
        </C.Modal>
      </C.View>
    </C.Pressable>
  );
};
