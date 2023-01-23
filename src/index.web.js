import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import ConnectMobileApp from './ConnectMobileApp';

AppRegistry.registerComponent(appName, () => ConnectMobileApp);
AppRegistry.runApplication(appName, {
  rootTag: document.getElementById('root'),
});
