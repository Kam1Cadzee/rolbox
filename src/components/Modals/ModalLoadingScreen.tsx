import React from 'react';
import {ActivityIndicator} from 'react-native';
import {useSelector} from 'react-redux';
import {useTheme} from '../../context/ThemeContext';
import {selectorsOther} from '../../redux/other/otherReducer';
import MyModal from './MyModal';

const ModalLoadingScreen = () => {
  const {secondary, lightText} = useTheme();
  const isLoadingScreen = useSelector(selectorsOther.getItem('isLoadingScreen')) as boolean;
  return (
    <MyModal
      onClose={() => null}
      bgColor={'transparent'}
      style={{
        backgroundColor: 'transparent',
      }}
      modalVisible={isLoadingScreen}>
      <ActivityIndicator size={'large'} color={secondary} />
    </MyModal>
  );
};

export default ModalLoadingScreen;
