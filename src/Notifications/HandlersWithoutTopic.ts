import {actionsUser} from '../redux/user/userReducer';
import authService from '../services/authService/authService';
import {FriendRequestStatus} from '../typings/IUser';
import {IPayloadRequestFriend} from '../typings/TypeTopic';
import {navigationRef} from '../utils/navigationRef';

class HandlersWithoutTopic {
  public static InvitationEvent_OpenApp(id: string) {
    navigationRef.current.navigate('MainNavigator', {
      screen: 'Event',
      params: {
        id,
      },
    });
  }

  public static async RequestFriend_Foreground(dispatch: any, data: IPayloadRequestFriend, userId: string) {
    const res = await authService.getUserById(data.requester);
    if (res.success) {
      dispatch(
        actionsUser.addFriendsResponse({
          _id: '',
          requester: res.data[0],
          responder: userId as any,
          status: FriendRequestStatus.pending,
        }),
      );
    }
    return res;
  }
  public static async RequestFriend_OpenApp(dispatch: any, data: IPayloadRequestFriend, userId: string) {
    const res = await authService.getUserById(data.requester);

    if (res.success) {
      navigationRef.current.navigate('FriendsNavigator', {
        screen: 'FriendProfile',
        params: {
          friend: res.data[0],
        },
      });
    }
  }
}

export default HandlersWithoutTopic;
