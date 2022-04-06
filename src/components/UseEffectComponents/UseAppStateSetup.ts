import React from 'react';
import {useEffect} from 'react';
import {AppState} from 'react-native';
import chatService from '../../services/chatService/chatService';
import {currentChatRef, lastMessageRef} from '../../utils/navigationRef';

const UseAppStateSetup = React.memo(() => {
  useEffect(() => {
    AppState.addEventListener('change', handleCommitUnreadMessage);

    return () => {
      AppState.removeEventListener('change', handleCommitUnreadMessage);
    };
  }, []);

  const handleCommitUnreadMessage = async (state) => {
    if (['background', 'inactive'].some((s) => s === state)) {
      if (currentChatRef.current && lastMessageRef.current) {
        chatService.commitLastMessage({id: currentChatRef.current, lastRead: lastMessageRef.current});
      }
    }
    if (state === 'active') {
    }
  };

  return null;
});

export default UseAppStateSetup;
