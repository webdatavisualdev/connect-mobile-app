import createReducer from './../createReducer';
import { IMessage as iGiftedMessage } from 'react-native-gifted-chat';

// : Leaf Imports
import saveConversation from './saveConversation';
import saveConversationId from './saveConversationId';

export interface iState {
  messages?: iGiftedMessage[];
  conversationId?: string;
}

const initialState: iState = {
  messages: undefined,
  conversationId: undefined,
};

export const ChatBotActions = {
  saveConversation: saveConversation.action,
  saveConversationId: saveConversationId.action,
};

export const ChatBotReducer = createReducer<iState>(initialState, {
  [saveConversation.key]: saveConversation.reducer,
  [saveConversationId.key]: saveConversationId.reducer,
});
