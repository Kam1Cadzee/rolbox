import Clipboard from '@react-native-community/clipboard';
import React, {useMemo} from 'react';
import {Linking} from 'react-native';
import Toast from 'react-native-toast-message';
import {TypeButton} from '../../controls/MyButton';
import BaseModalSheetActions from './BaseModalSheetActions';

interface IUrlModalSheetActionsProps {
  url: string;
  modalVisible: boolean;
  onClose: any;
}
const UrlModalSheetActions = ({modalVisible, onClose, url}: IUrlModalSheetActionsProps) => {
  const options = useMemo(() => {
    return [
      {
        onPress: async () => {
          if (!url.startsWith('https')) {
            url = 'https://' + url;
          }
          const canOpen = await Linking.canOpenURL(url);

          if (canOpen) {
            await Linking.openURL(url);
          }
        },
        title: 'Open the link',
        type: TypeButton.lightFog,
      },
      {
        onPress: () => {
          Clipboard.setString(url);
          Toast.show({
            text1: 'Url copied to clipboard', //TODO:
            type: 'info',
            position: 'bottom',
            autoHide: true,
            visibilityTime: 1000,
          });
          onClose();
        },
        title: 'Copy',
        type: TypeButton.lightFog,
      },
    ];
  }, []);
  return <BaseModalSheetActions modalVisible={modalVisible} onClose={onClose} options={options} />;
};

export default UrlModalSheetActions;
