import * as React from 'react';
import { Bubble, BubbleProps, GiftedChat, IMessage as iGiftedMessage } from 'react-native-gifted-chat';
import { Activity as iDirectActivity, Message } from 'botframework-directlinejs';

// : Hooks
import H, { Routes, AllActions, iReduxState } from './../../Hooks';

// : Components
import C from './../../Components';

export const Chatbot: React.FC = () => {
  // Hooks Declarations
  const [debug, log, warn, error, tags, titles, legacyLog] = H.Logs.useLog({ source: 'chatbot.tsx' });
  const logPress = H.Logs.useLog_userPress({ source: 'chatbot.tsx' });
  const isDebug = H.NPM.redux.useSelector((s: iReduxState) => s.Dev.visualDebugging);
  const StoredMessages = H.NPM.redux.useSelector((s: iReduxState) => s.ChatBot.messages);
  const StoredConversationId = H.NPM.redux.useSelector((s: iReduxState) => s.ChatBot.conversationId);
  const dispatch = H.NPM.redux.useDispatch();
  const nav = H.NPM.navigation.useNavigation();
  const userProfile = H.Queries.useQuery_UserProfile();
  const [giftedChatMessages, setGiftedChatMessages] = React.useState<iGiftedMessage[]>(StoredMessages ? StoredMessages : []);
  const directLine = H.Misc.useDirectLine(StoredConversationId);
  const [isTyping, setIsTyping] = React.useState<boolean>();
  const [showLoading, setShowLoading] = React.useState(true);
  const headerHeight = H.NPM.navigation.useHeaderHeight();

  React.useEffect(() => {
    directLine.directLine.activity$.subscribe(
      (newItem) => {
        const temp = parseToGiftedChat(newItem);
        if (temp) {
          setGiftedChatMessages((prev) => GiftedChat.append(prev, [temp]));
        }
      },
      (err) => error('Error Subscribing to new activity', '', { id: '1631054204', extraData: err }),
      () => log('Observable Complete', '', { id: '1631054251' }),
    );
  }, []);

  const parseToGiftedChat = (itm: iDirectActivity): (iGiftedMessage & { DirectLine: Message }) | undefined => {
    if (itm.type === 'message' && itm.from.name === 'AIT Support Chat') {
      setIsTyping(false);
      return {
        DirectLine: itm,
        _id: itm.id || Date.now().toString(),
        text: itm.text || 'Message was Blank',
        createdAt: itm.timestamp ? new Date(itm.timestamp) : Date.now(),
        user: {
          _id: itm.from.id,
          name: itm.from.name,
          avatar: require('./../../Assets/Grace-Agent-Chatbot-Avatar.png'),
        },
      };
    }
  };

  const _basic_SendMessage = (text: string) => {
    const msg: iGiftedMessage = {
      _id: Date.now(),
      text,
      createdAt: Date.now(),
      user: {
        _id: userProfile.data?.AccountName || 1,
        name: userProfile.data?.DisplayName,
      },
    };

    setGiftedChatMessages((prev) => GiftedChat.append(prev, [msg]));
    setIsTyping(true);

    directLine.sendMessage({
      from: {
        id: userProfile.data?.Properties.UserName.toLowerCase() as string,
        name: userProfile.data?.DisplayName as string,
      },
      type: 'message',
      text,
    });
  };

  const _handle_GiftedChat_onSend = React.useCallback(
    (newMessages: iGiftedMessage[] | any[] = []) => {
      setGiftedChatMessages((prev) => GiftedChat.append(prev, newMessages));
      setIsTyping(true);
      newMessages.forEach((msg) =>
        directLine.sendMessage({
          from: {
            id: userProfile.data?.Properties.UserName.toLowerCase() as string,
            name: userProfile.data?.DisplayName as string,
          },
          type: 'message',
          text: msg.text,
        }),
      );
    },
    [userProfile.data?.Properties['UserProfile_GUID'], userProfile.data?.DisplayName],
  );

  const _handle_CloseChatBot = () => {
    logPress('Chatbot_Close', '1625606811', 'btn');
    const title = 'Close Chat Bot';
    const message = 'Are you sure you want to close the Chat Bot?  This will end your current session.';
    const buttons: any = [
      {
        text: 'End Session',
        onPress: () => {
          logPress('Confirm_Chatbot_Close', '1625606835', 'dialog');
          dispatch(AllActions.ChatBot.saveConversation({ newMessages: [] }));
          dispatch(AllActions.ChatBot.saveConversationId({ conversationId: undefined }));
          nav.goBack();
        },
        style: 'destructive',
      },
      {
        text: 'Cancel',
        onPress: () => {
          logPress('Cancel_Chatbot_Close', '1625606863', 'dialog');
        },
        style: 'cancel',
      },
    ];
    C.Alert.alert(title, message, buttons);
  };

  const _handle_MinimizeChatBot = () => {
    logPress('Chatbot_Minimize', '1625606740', 'btn');
    dispatch(AllActions.ChatBot.saveConversation({ newMessages: giftedChatMessages }));
    dispatch(AllActions.ChatBot.saveConversationId({ conversationId: directLine.conId }));
    nav.goBack();
  };

  const _handle_AdaptiveCardAction = (e: any) => {
    switch (e.type) {
      case 'Action.OpenUrl':
        nav.navigate(Routes.webview, { url: e.url });
        break;
      case 'Action.Submit':
        _basic_SendMessage(e.data.actionData);
        break;
      case 'Action.ShowCard':
        C.Alert.alert(e.type + ' Not Yet Supported', JSON.stringify(e, undefined, 2));
        break;
      case 'Action.Execute':
        C.Alert.alert(e.type + ' Not Yet Supported', JSON.stringify(e, undefined, 2));
        break;
      default:
        C.Alert.alert(e.type + ' Not Supported', JSON.stringify(e, undefined, 2));
    }
  };

  const RenderCustom = (
    props: Readonly<BubbleProps<iGiftedMessage>> & Readonly<{ children?: React.ReactNode }> & { currentMessage: { DirectLine: Message } },
  ) => {
    let adaptiveCard: any = undefined;
    if (props.currentMessage.DirectLine?.attachments !== undefined) {
      props.currentMessage.DirectLine.attachments.forEach((attachment) => {
        if (adaptiveCard === undefined) {
          if ((attachment as any).content?.type === 'AdaptiveCard') adaptiveCard = (attachment as any).content;
        }
      });
    }

    if (adaptiveCard || (false /* Forced off normally, for debugging */ && props.currentMessage.text === 'Hello there.')) {
      return (
        <C.Card style={{ flex: 1, marginRight: 8 }}>
          <C.AdaptiveCard payload={adaptiveCard ? adaptiveCard : sampleAdaptiveCardPayload} onExecuteAction={_handle_AdaptiveCardAction} />
          {isDebug ? <C.JSONTree data={props} shouldExpandNode={(keyname: string) => false} /> : undefined}
        </C.Card>
      );
    } else {
      return (
        <C.View>
          <Bubble {...props} />
          {isDebug ? <C.JSONTree data={props} shouldExpandNode={(keyname: string) => false} /> : undefined}
        </C.View>
      );
    }
  };

  return (
    <C.Container>
      <C.KeyboardAvoidingView behavior={C.RNPlatform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }} keyboardVerticalOffset={headerHeight}>
        <C.View style={{ position: 'absolute', width: '100%', height: '100%', display: showLoading ? 'flex' : 'none' }}>
          <C.View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <C.Title purpose="headline" style={{ flex: undefined, alignSelf: 'center', textAlign: 'center', marginVertical: 15, color: 'grey' }}>
              Chatbot UI is Loading
            </C.Title>
            <C.Title purpose="subheading" style={{ flex: undefined, alignSelf: 'center', textAlign: 'center', marginVertical: 15, color: 'grey' }}>
              The Chatbot User Interface is loading...
            </C.Title>
            <C.Spinner style={{ flex: undefined, alignSelf: 'center', marginVertical: 15 }} color="grey" />
          </C.View>
        </C.View>
        <C.ScrollView
          style={{ flex: 1, backgroundColor: 'white', borderColor: 'salmon', borderWidth: 3, padding: 5, margin: 5, display: isDebug ? 'flex' : 'none' }}>
          <C.Text>
            Conversation ID: Redux({StoredConversationId || 'Undefined'}) DirectLine({directLine.conId || 'Undefined'})
          </C.Text>
          <C.Text>Status: {directLine.status}</C.Text>
          <C.Text>
            isTyping: state({isTyping}) DirectLine({directLine.isTyping})
          </C.Text>
          <C.View>
            <C.AdaptiveCard payload={sampleAdaptiveCardPayload} />
          </C.View>
          <C.JSONTree data={{ giftedChatMessages, DLEvents: directLine.events, DirectLineObject: directLine }} />
        </C.ScrollView>
        <C.View
          onLayout={() => {
            setShowLoading(false);
          }}
          style={{ flex: 2 }}>
          <GiftedChat
            isKeyboardInternallyHandled={false}
            messages={giftedChatMessages}
            onSend={(newMessage) => _handle_GiftedChat_onSend(newMessage)}
            isTyping={isTyping}
            messagesContainerStyle={{ backgroundColor: 'white' }}
            renderBubble={RenderCustom}
            user={{
              _id: userProfile.data?.AccountName || 1,
              name: userProfile.data?.DisplayName,
              avatar: userProfile.data?.PictureUrl,
            }}
          />
        </C.View>
      </C.KeyboardAvoidingView>
    </C.Container>
  );
};

const sampleAdaptiveCardPayload = {
  type: 'AdaptiveCard',
  body: [
    {
      type: 'TextBlock',
      size: 'Medium',
      weight: 'Bolder',
      text: 'Adaptive Cards Rock!',
    },
    {
      type: 'TextBlock',
      wrap: true,
      text:
        "Adaptive Cards Rock! This is the body text... This is a simple test to see if the adaptive cards will render in our application without a hitch! If you're reading this then the test was successful! ",
    },
    {
      type: 'FactSet',
      facts: [
        {
          title: 'Fact #1',
          value: 'Fact Sets are like this',
        },
        {
          title: 'Adaptive Cards are Kewl',
          value: 'true',
        },
      ],
      separator: true,
    },
    {
      type: 'Input.Text',
      placeholder: 'Text input test',
      id: 'textInputTest',
    },
    {
      type: 'Input.Toggle',
      title: 'Toggle input test',
      id: 'testToggleInput',
    },
  ],
  actions: [
  ],
  $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
  version: '1.3',
};
