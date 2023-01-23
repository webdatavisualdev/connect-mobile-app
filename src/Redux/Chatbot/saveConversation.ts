import { Action } from 'redux';
import { iState } from '.';
import iStandardRedux from './../iStandardRedux';
import { IMessage as iGiftedMessage } from 'react-native-gifted-chat';

const key = '@ChatBot/saveConversation';

interface iAction extends Action {
  newMessages: iGiftedMessage[];
}

interface iPayload {
  newMessages: iGiftedMessage[];
}

const action = (payload: iPayload): iAction => ({
  type: key,
  newMessages: payload.newMessages,
});

const reducer = (state: iState, action: iAction): iState => {
  return { ...state, messages: action.newMessages };
};

export default {
  key,
  action,
  reducer,
} as iStandardRedux<iState, iPayload, iAction>;
