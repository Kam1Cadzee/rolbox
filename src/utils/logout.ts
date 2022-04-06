import {GoogleSignin} from '@react-native-google-signin/google-signin';
import FirebaseCrash from '../Crashlytics/FirebaseCrash';
import SentryCrash from '../Crashlytics/Sentry';
import SentryTypeError from '../typings/SentryTypeError';
import auth from '@react-native-firebase/auth';

const simpleSignOut = async () => {
  try {
    await auth().signOut();
  } catch (e) {
    console.error({e});
    SentryCrash.catch(e, SentryTypeError.SimpleSignOut);
    FirebaseCrash.catch(e, SentryTypeError.SimpleSignOut);
  }
};

const googleSignOut = async () => {
  try {
    await GoogleSignin.revokeAccess();
  } catch (e) {
    console.error({e});
    SentryCrash.catch(e, SentryTypeError.GoogleRevokeSignOut);
    FirebaseCrash.catch(e, SentryTypeError.GoogleRevokeSignOut);
  }
  try {
    await GoogleSignin.signOut();
  } catch (e) {
    console.error({e});
    SentryCrash.catch(e, SentryTypeError.GoogleSignOut);
    FirebaseCrash.catch(e, SentryTypeError.GoogleSignOut);
  }
};

export {simpleSignOut, googleSignOut};
