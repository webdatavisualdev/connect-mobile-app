import * as React from 'react';
import { DirectLine, Activity as iDirectActivity, ConnectionStatus, Message, EventActivity, Typing } from 'botframework-directlinejs';

// : Hooks
import H from './../Hooks';

export interface iUseDirectLine {
  events: iDirectActivity[];
  status: 'uninitialized' | 'connecting' | 'online' | 'ended' | 'expired_token' | 'failed_to_connect';
  isTyping: any;
  sendMessage: (params: iSendMessageParams) => void;
  directLine: DirectLine;
  conId?: string;
}

export interface iSendMessageParams {
  from: {
    id: string;
    name: string;
  };
  type: 'message';
  text: string;
}

export const useDirectLine = (conversationId?: string) => {
  const Experiment_DirectLineKey = H.DEV.useExperiment<boolean>({
    key: 'DirectLineKey',
    category: 'ChatBot',
    name: 'Swap Direct Line Key',
    description:
      'Replace the Direct Line Key for the chat bot with an alternative, currently the default setting is Production and Enabling this flag will use the Development Key',
    setting: false,
    defaultSetting: false,
  });

  const ProdKey = '1_3KU2I4b8s.5ErUOLoXjiS540FeGrhgXj4Dag65HIYrKtKPl0-DN0I';
  const DevKey = '1yrvy0wzBHo.NjqFFIO0ENG7ZmFhs0YAViVbPh15J0zgOG61jiRJdys';
  const [directLine, setDirectLine] = React.useState(
    new DirectLine({
      secret: Experiment_DirectLineKey?.setting ? DevKey : ProdKey,
      conversationId, // Conversation ID is optionally supplied, should resume existing conversation if present
    }),
  );
  const [debug, log, warn, error, tags, titles, legacyLog] = H.Logs.useLog({ source: 'useDirectLine.ts' });
  const [directLineSubscription, setDirectLineSubscription] = React.useState<any>();
  const [events, setEvents] = React.useState<iDirectActivity[]>([]);
  const [status, setStatus] = React.useState<'uninitialized' | 'connecting' | 'online' | 'ended' | 'expired_token' | 'failed_to_connect'>('uninitialized');
  const [conId, setConId] = React.useState<string | undefined>(undefined);
  const statusRef = React.useRef('uninitialized');
  const [isTyping, setIsTyping] = React.useState();
  const userProfile = H.Queries.useQuery_UserProfile();
  const crash = H.Firebase.useCrashlytics();

  React.useEffect(() => {
    log(`Chatbot Attempting to resume conversation`, `Conversation ID: ${conversationId}`, {
      id: '1625607937',
      analytics: { name: 'Chatbot_Resume_Conversation', stripExtraData: false },
      extraData: {
        conversationId,
      },
    });
  }, []);

  React.useEffect(() => {
    statusRef.current = status;
  }, [status]);

  // Initialize Effect
  React.useEffect(() => {
    if (userProfile.data?.AccountName) {
      directLine.connectionStatus$.subscribe((s) => _handle_DirectLine_ConnectionStatus(s));
      const subscription = directLine.activity$.subscribe((activity) => {
        switch (activity.type) {
          case 'event': {
            _handle_DirectLine_event(activity);
            break;
          }
          case 'message': {
            _handle_DirectLine_Message(activity);
            break;
          }
          case 'typing': {
            _handle_DirectLine_Typing(activity);
            break;
          }
        }
      });
      setDirectLineSubscription(subscription);
      _handle_initConnection();
    }
  }, [userProfile.data?.AccountName]);

  const _handle_initConnection = (terminate?: boolean) => {
    const initPostActivity: iDirectActivity = {
      type: 'event',
      value: {
        scope: 'Withum Directline Webpart',
        uri: '//withum.directline.webpart',
        type: 'scope initialization',
        id: userProfile.data?.Properties.UserProfile_GUID,
        userId: userProfile.data?.Properties.UserName.toLowerCase(),
        name: userProfile.data?.DisplayName,
      },
      from: {
        id: userProfile.data?.Properties.UserName.toLowerCase() as string,
        name: userProfile.data?.DisplayName,
      },
      name: 'ConnectMobileApp',
    };
    debug('ChatBot Init Connection', '', { id: '1633375020', extraData: { initPostActivity, status: statusRef.current } });
    directLine.postActivity(initPostActivity).subscribe(
      (_obs) => {
        log(`Init Chatbot Complete`, `Observable: ${_obs}`, {
          id: '1625587248',
          analytics: { name: 'Chatbot_Initialized', stripExtraData: false },
          extraData: { _obs, status: statusRef.current },
        });
        // : Removing Second call as its not needed for its original design
        // : Leaving in place to provide an example of how this recusive function works
        // : Re-Enabling because of change on Server Side Chatbot, this is needed again...
        if (!terminate)
          globalThis.setTimeout(() => {
            _handle_initConnection(true);
          }, 1000);
      },
      (err) => error('Error in Post Activity', '', { id: '1634572402', extraData: err }),
    );
  };

  const _handle_DirectLine_Message = (activity: Message) => {
    log(`Received a Chatbot Event (Message) from DirectLine`, '', {
      id: '1625587386',
      analytics: { name: 'Chatbot_Event_Message', stripExtraData: true },
      extraData: { event: activity },
    });
    setConId(activity.conversation?.id);
    setEvents((prev) => [...prev, activity]);
  };

  const _handle_DirectLine_Typing = (activity: Typing) => {
    debug('Received a Chatbot Event (Typing) from DirectLine', '', { id: '1625587603' });
    setEvents((prev) => [...prev, activity]);
  };

  const _handle_DirectLine_event = (activity: EventActivity) => {
    log('Received a Chatbot Event (Event) from DirectLine', '', {
      id: '',
      analytics: { name: 'Chatbot_Event_Event', stripExtraData: true },
      extraData: { event: activity },
    });
    setEvents((prev) => [...prev, activity]);
  };

  const _handle_DirectLine_ConnectionStatus = (status: ConnectionStatus) => {
    let s: 'uninitialized' | 'connecting' | 'online' | 'ended' | 'expired_token' | 'failed_to_connect' = 'uninitialized';
    switch (status) {
      case ConnectionStatus.Uninitialized: {
        s = 'uninitialized';
        break;
      }
      case ConnectionStatus.Connecting: {
        s = 'connecting';
        break;
      }
      case ConnectionStatus.Online: {
        s = 'online';
        break;
      }
      case ConnectionStatus.Ended: {
        s = 'ended';
        break;
      }
      case ConnectionStatus.ExpiredToken: {
        s = 'expired_token';
        break;
      }
      case ConnectionStatus.FailedToConnect: {
        s = 'failed_to_connect';
        break;
      }
    }
    debug(`Chatbot Status: ${s}`, '', { id: '1625587756' });
    crash.setAttribute('Chatbot_Status', s);
    setStatus(s);
  };

  const sendMessage = (params: iSendMessageParams) => {
    if (statusRef.current === 'online') {
      directLine
        .postActivity({
          from: {
            id: params.from.id,
            name: params.from.name,
          },
          type: 'message',
          text: params.text,
        })
        .subscribe(
          () => {
            log('Chatbot Sent Message', '', { id: '1625587831', analytics: { name: 'Chatbot_Message_Sent', stripExtraData: true } });
          },
          () => {
            error('Chatbot Failed to send Message', '', {
              id: '1625587887',
              analytics: { name: 'Chatbot_Message_Send_Failed', stripExtraData: true },
              tags: [tags.error, tags.network],
            });
          },
        );
    }
  };

  const hook: iUseDirectLine = {
    events,
    status,
    isTyping,
    sendMessage,
    directLine,
    conId,
  };
  return hook;
};
