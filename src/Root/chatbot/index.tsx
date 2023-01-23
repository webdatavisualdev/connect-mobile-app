import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// : Hooks
import { Routes } from './../../Hooks';

// : Misc
import M from './../../Misc';

// : Screens
import { Chatbot } from './chatbot';

export const ChatbotStack: React.FC = () => {
  const ChatNav = createStackNavigator();

  return (
    <>
      <ChatNav.Navigator initialRouteName={Routes.chatbot} screenOptions={{ ...M.Tools.NavitationScreenOptions }}>
        <ChatNav.Screen name={Routes.chatbot} component={Chatbot} />
      </ChatNav.Navigator>
    </>
  );
};
