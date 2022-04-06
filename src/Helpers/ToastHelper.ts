import Toast from 'react-native-toast-message';
import {sizes} from '../context/ThemeContext';
import {SelectorsEvent} from '../redux/event/eventReducer';
import {IMessageUpdate} from '../typings/IChat';
import {UserExtension} from '../typings/IUser';
import {isIOS} from '../utils/isPlatform';
import {currentChatRef, getStoreRef, navigationRef} from '../utils/navigationRef';

interface IShowToast {
  text1?: string;
  text2?: string;
  onPress?: any;
}
class ToastHelper {
  public static showToastMessage(message: IMessageUpdate) {
    ToastHelper.showToast({
      text1: UserExtension.fullName(message.from),
      text2: message.message,
      onPress: () => {
        if (currentChatRef.current !== message.chat) {
          const chat = SelectorsEvent.getChatsById(getStoreRef.current(), message.chat);
          navigationRef.current.navigate('AdditionalNavigator', {
            screen: 'Chat',
            params: {
              chat: chat,
              localMessage: message,
            },
          });
        }
      },
    });
  }

  public static showToast({onPress, text1, text2}: IShowToast) {
    Toast.show({
      text1,
      text2,
      type: 'info',
      position: 'top',
      autoHide: true,
      visibilityTime: 3000,
      topOffset: isIOS ? sizes[40] : 0,

      onPress: () => {
        Toast.hide();
        onPress();
      },
    });
  }
}

export default ToastHelper;
