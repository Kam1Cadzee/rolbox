import {isIOS} from '../utils/isPlatform';
import messaging from '@react-native-firebase/messaging';
import {TitleTopics} from '../typings/TypeTopic';

const subscribeTopic = async (topic: TitleTopics) => {
  return await messaging().subscribeToTopic(`${isIOS ? 'ios' : 'android'}.${topic}`);
};

const unsubscribeTopic = async (topic: TitleTopics) => {
  return await messaging().unsubscribeFromTopic(`${isIOS ? 'ios' : 'android'}.${topic}`);
};

const subscribeChat = async (idChat: string) => {
  return messaging().subscribeToTopic(`chat.${idChat}`);
};

const unsubscribeChat = async (idChat: string) => {
  return messaging().unsubscribeFromTopic(`chat.${idChat}`);
};

const subscribeEvent = async (idChat: string) => {
  return messaging().subscribeToTopic(`event.${idChat}`);
};

const unsubscribeEvent = async (idChat: string) => {
  return messaging().unsubscribeFromTopic(`event.${idChat}`);
};

export {unsubscribeTopic, subscribeTopic, subscribeChat, unsubscribeChat, subscribeEvent, unsubscribeEvent};
