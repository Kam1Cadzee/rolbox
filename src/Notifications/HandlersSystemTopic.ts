import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {actionsUser} from '../redux/user/userReducer';
import loadRemoteConfig from '../utils/loadRemoteConfig';
import {simpleSignOut, googleSignOut} from '../utils/logout';

class HandlersSystemTopic {
  public static async Config_Foreground(dispatch?: any) {
    return await loadRemoteConfig(dispatch, true);
  }
  public static async SignOutGoogle_Foreground(dispatch?: any) {
    const res = await GoogleSignin.isSignedIn();

    if (res) {
      await simpleSignOut();
      await googleSignOut();

      dispatch(actionsUser.setIsAuth(false));
    }
  }
}

export default HandlersSystemTopic;
