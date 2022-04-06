import React from 'react';
import App from './App';
import UseNotificationSetup from './components/UseEffectComponents/UseNotificationSetup';
import UseConfigLoadSetup from './components/UseEffectComponents/UseConfigLoadSetup';
import UseDeepLinkSetup from './components/UseEffectComponents/UseDeepLinkSetup';
import UseAppStateSetup from './components/UseEffectComponents/UseAppStateSetup';
import {useSelector} from 'react-redux';
import {selectorsUser} from './redux/user/userReducer';

const Content = React.memo(() => {
  const isAuth = useSelector(selectorsUser.isAuth);

  return (
    <React.Fragment>
      <UseConfigLoadSetup />
      {isAuth && <UseNotificationSetup />}
      <UseDeepLinkSetup />
      <UseAppStateSetup />
      <App />
    </React.Fragment>
  );
});

export default Content;
