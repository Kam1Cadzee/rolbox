import DeviceInfo from 'react-native-device-info';

const getUniqueId = async () => {
  return await DeviceInfo.syncUniqueId();
};

export default getUniqueId;
