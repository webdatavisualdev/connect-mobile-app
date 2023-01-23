import * as React from 'react';
import remoteConfig from '@react-native-firebase/remote-config';

// : Hooks
import H from './../../Hooks';

export interface iRemoteConfig {
  App_Version?: string;
  App_Version_Old?: string;
  AuthEngine?: string;
  AuthEnrollment?: string;
  Team_Member_Matching?: string;
  TestRemoteConfig?: string;
}

export const useRemoteConfig = () => {
  const [debug, log, warn, error, tags, titles, legacyLog] = H.Logs.useLog({ source: 'useRemoteConfig.ts' });
  const [initDone, setInitDone] = React.useState(false);
  const [state, setState] = React.useState<iRemoteConfig>({}); // TODO Init with Default Values

  const init = async () => {
    await remoteConfig().setDefaults({});
    const remoteConfigs = await remoteConfig().fetchAndActivate();
    if (remoteConfigs) {
      debug('Retrieved Remote Configs', 'Success', { id: '1631047733', extraData: { remoteConfigs } });
    } else {
      debug('Retrieved Remote Configs', 'Failed', { id: '1631047733', extraData: { remoteConfigs } });
    }
    setInitDone(true);
  };

  React.useEffect(() => {
    init();
  }, []);

  React.useEffect(() => {
    if (initDone) {
      const config = remoteConfig().getAll();
      let newState: { [key: string]: string } = {};
      Object.entries(config).forEach((itm) => {
        const [key, val] = itm;
        newState[key] = val.asString();
      });
      debug('Remote Configs', '', { id: '1631048031', extraData: { config: newState } });
      setState(newState);
    }
  }, [initDone]);

  return state;
};
