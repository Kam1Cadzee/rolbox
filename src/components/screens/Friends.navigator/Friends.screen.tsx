import React, {useMemo, useState} from 'react';
import auth from '@react-native-firebase/auth';
import {AccessToken, GraphRequest, GraphRequestManager, LoginManager} from 'react-native-fbsdk';
import {StyleSheet, SafeAreaView} from 'react-native';
import {useSelector} from 'react-redux';
import {FriendsScreenProps} from '../../navigators/Friends.navigator';
import {fbPermissions} from '../../../config/config';
import {sizes, useTheme} from '../../../context/ThemeContext';
import VerticalTabs from '../../common/VerticalTabs';
import IOption from '../../../typings/IOption';
import MyInputText from '../../controls/MyInputText';
import IconButton from '../../controls/IconButton';
import FriendsList from '../../common/FriendsList';
import Icon from '../../common/Icons';
import MyText from '../../controls/MyText';
import {selectorsUser} from '../../../redux/user/userReducer';
import t from '../../../utils/t';
import ContactsList from '../../common/ContactsList';
import useSharing from '../../../useHooks/useSharing';
import TouchableOpacityGestureDelay from '../../controls/TouchableOpacityGestureDelay';

const FriendsScreen = ({}: FriendsScreenProps) => {
  const options: IOption<string>[] = useMemo(() => {
    return [
      {
        label: t('myFriends'),
        value: '0',
      },
      {
        label: t('more'),
        value: '1',
      },
    ];
  }, []);
  const {shareFriend} = useSharing();
  const {text, backgroundDark, accent} = useTheme();
  const [selected, setSelected] = useState(options[0]);
  const [search, setSearch] = useState('');
  const friendsRequests = useSelector(selectorsUser.getFriendsResponses);
  const friends = useSelector(selectorsUser.getFriends);
  // todo link facebook
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onFacebookButtonPress = async () => {
    try {
      // Attempt login with permissions
      const result = await LoginManager.logInWithPermissions(fbPermissions);
      if (result.isCancelled) {
        throw new Error('User cancelled the login process');
      }

      const data = await AccessToken.getCurrentAccessToken();

      if (!data) {
        throw new Error('Something went wrong obtaining access token');
      }

      const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

      await auth().currentUser!.linkWithCredential(facebookCredential);
    } catch (e) {}
  };

  const onFriends = async () => {
    const data = await AccessToken.getCurrentAccessToken();
    getFriends(data!.accessToken, data!.userID);
  };

  const getFriends = (accessToken: string, id: string) =>
    new Promise((resolve) => {
      const infoRequest = new GraphRequest(
        `/${id}/friends?fields=id`,
        {accessToken, httpMethod: 'GET'},
        (error, result: any) => {
          if (error) {
            resolve(null);
            return;
          }

          resolve(result ? (result.email as string) : null);
        },
      );
      new GraphRequestManager().addRequest(infoRequest).start();
    });

  const handleSelect = (option: IOption<string>) => {
    setSearch('');
    setSelected(option);
  };

  return (
    <SafeAreaView style={styles.con}>
      {/*  <MyButton onPress={onFacebookButtonPress}>link</MyButton>
      <MyButton onPress={onFriends}>friends</MyButton>
       <MyButton onPress={getContacts}>contact</MyButton>
      <MyButton onPress={googleApi}>Google API</MyButton>
       */}
      <VerticalTabs<string> style={styles.vertTabs} options={options} select={selected} setOption={handleSelect} />
      <MyInputText
        rightComponent={
          <IconButton
            style={{
              marginRight: sizes[10],
            }}
            icon={{
              name: 'SearchIcon',
              fill: text,
              size: sizes[16],
            }}
          />
        }
        styleCon={styles.view}
        value={search}
        onChangeText={setSearch}
      />
      <TouchableOpacityGestureDelay
        onPress={shareFriend}
        style={[
          styles.btn,
          {
            backgroundColor: backgroundDark,
          },
        ]}>
        <Icon name="ShareIcon" fill={accent} size={sizes[15]} />
        <MyText
          style={{
            marginLeft: sizes[10],
            color: accent,
          }}>
          {t('createInviteLink')}
        </MyText>
      </TouchableOpacityGestureDelay>
      {selected.value === options[0].value && (
        <FriendsList search={search} friendsRequests={friendsRequests} friends={friends} />
      )}
      {selected.value === options[1].value && <ContactsList search={search} />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  con: {
    margin: sizes[20],
    flexGrow: 1,
  },
  vertTabs: {
    marginBottom: sizes[16],
  },
  view: {
    marginBottom: sizes[16],
  },
  btn: {
    borderRadius: sizes[4],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: sizes[12],
    marginBottom: sizes[15],
  },
});

export default FriendsScreen;
