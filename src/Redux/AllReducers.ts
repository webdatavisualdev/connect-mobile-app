import { combineReducers } from 'redux';

// : Import Different Branches of the Redux Store here to be combined in the
// : combine reducers Function
import { SampleReducer as Sample } from './Sample';
import { HooksReducer as Hooks } from './Hooks';
import { AuthReducer as Auth } from './Auth';
import { DevReducer as Dev } from './Dev';
import { ChatBotReducer as ChatBot } from './Chatbot';
import { MainReducer as Main } from './Main';

export const rootReducer = combineReducers({
  Sample,
  Hooks,
  Auth,
  Dev,
  ChatBot,
  Main,
});
