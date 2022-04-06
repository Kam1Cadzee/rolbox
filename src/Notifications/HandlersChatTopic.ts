import ToastHelper from '../Helpers/ToastHelper';
import {actionsEvent, SelectorsEvent} from '../redux/event/eventReducer';
import chatService from '../services/chatService/chatService';
import {IMessageUpdate, IMessage} from '../typings/IChat';
import ManagerMessage from '../typings/IMessage';
import getIdObj from '../utils/getIdObj';
import {currentChatRef, getStoreRef, navigationRef} from '../utils/navigationRef';

class HandlersChatTopic {
  public static async ReceiveMessage_Foreground(dispatch: any, message: IMessageUpdate, userId: string) {
    if (!userId) {
      return;
    }
    if (getIdObj(message.from) === userId) {
      return;
    }
    if (currentChatRef.current !== message.chat) {
      ToastHelper.showToastMessage(message);
    }
    message.isUpdateUnreadMessages = true;
    ManagerMessage.emit(message);
    dispatch(actionsEvent.updateChat(message));
  }
  public static async ReceiveMessage_Background(dispatch: any, message: IMessageUpdate, userId: string) {
    if (!userId) {
      return;
    }
    if (getIdObj(message.from) === userId) {
      return;
    }
    message.isUpdateUnreadMessages = true;
    ManagerMessage.emit(message);
    dispatch(actionsEvent.updateChat(message));
  }
  public static async ReceiveMessage_OpenApp(dispatch: any, message: IMessage) {
    let chat = SelectorsEvent.getChatsById(getStoreRef.current(), message.chat);
    if (!chat) {
      const res = await chatService.getChatById(message.chat);
      if (res.success) {
        chat = res.data;
        dispatch(actionsEvent.addChat(res.data));
      }
    }

    if (chat) {
      navigationRef.current.navigate('AdditionalNavigator', {
        screen: 'Chat',
        params: {
          chat,
        },
      });
    }
  }
}

export default HandlersChatTopic;
