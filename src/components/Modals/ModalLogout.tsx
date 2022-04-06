import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import ModalConfirm from './ModalConfirm';
import {actionsUser, selectorsUser} from '../../redux/user/userReducer';
import t from '../../utils/t';
import {LoginManager} from 'react-native-fbsdk';
import Providers from '../../constants/Providers';
import {googleSignOut, simpleSignOut} from '../../utils/logout';
import {unsubscribeAll} from '../../redux/thunkes';

interface IModalLogoutProps {
  modalVisible: boolean;
  onClose: any;
}

const ModalLogout = ({modalVisible, onClose}: IModalLogoutProps) => {
  const dispatch = useDispatch();
  const isGoogle = useSelector(selectorsUser.isExistsProvider(Providers.GOOGLE));
  const isFacebook = useSelector(selectorsUser.isExistsProvider(Providers.FACEBOOK));
  const [isLoading, setIsLoading] = useState(false);
  const logOut = async () => {
    setIsLoading(true);

    await dispatch(unsubscribeAll());
    await simpleSignOut();
    if (isGoogle) {
      await googleSignOut();
    }
    if (isFacebook) {
      await LoginManager.logOut();
    }

    dispatch(actionsUser.setIsAuth(false));
    onClose();
    setIsLoading(false);
  };

  return (
    <ModalConfirm
      modalVisible={modalVisible}
      onClose={onClose}
      onConfirm={logOut}
      confirmText={t('logOut')}
      title={t('logOutTitle')}
      subTitle={t('textToLogout')}
      isLoading={isLoading}
    />
  );
};

export default ModalLogout;
