import AsyncStorage from '@react-native-async-storage/async-storage';
import SharedGroupPreferences from 'react-native-shared-group-preferences';
import {isIOS} from './isPlatform';

const saveToStorage = async (key: string, value: string | null) => {
  if (isIOS) {
    await SharedGroupPreferences.setItem(key, value, 'group.com.huspi.rolbox');
  } else {
    if (value) {
      await AsyncStorage.setItem(key, value);
    } else {
      await AsyncStorage.removeItem(key);
    }
  }
};

const getFromStorage = async (key: string) => {
  if (isIOS) {
    return await SharedGroupPreferences.getItem(key, 'group.com.huspi.rolbox');
  } else {
    return await AsyncStorage.getItem(key);
  }
};

export {saveToStorage, getFromStorage};
