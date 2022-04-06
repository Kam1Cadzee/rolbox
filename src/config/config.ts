import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {Permissions} from 'react-native-fbsdk';

const fbPermissions: Permissions[] = ['public_profile', 'email'];
const ignoreList = [/'defaultValue'/];

const configGoogleSignin = () => {
  GoogleSignin.configure({
    webClientId: '211411402583-c451f5seaj9s6hjirb43tk8sp0m19vtg.apps.googleusercontent.com',
    iosClientId: '211411402583-pbbfgi7lhj4bh35l15t3e7321rodjfvk.apps.googleusercontent.com',
    scopes: ['profile', 'email'],
  });
};
export {fbPermissions, configGoogleSignin, ignoreList};
