import { Action } from 'redux';
import { iState } from '.';
import iStandardRedux from './../iStandardRedux';

const key = '@ChatBot/saveConversationId';

interface iAction extends Action {
  conversationId?: string;
}

interface iPayload {
  conversationId?: string;
}

const action = (payload: iPayload): iAction => ({
  type: key,
  conversationId: payload.conversationId,
});

const reducer = (state: iState, action: iAction): iState => {
  return { ...state, conversationId: action.conversationId };
};

export default {
  key,
  action,
  reducer,
} as iStandardRedux<iState, iPayload, iAction>;
