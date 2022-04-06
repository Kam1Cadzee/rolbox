import React from 'react';
import {StyleSheet} from 'react-native';
import {IMessageItem, ITextMessage} from '../../typings/IMessage';
import BaseMessage from './BaseMessage';
import ParseTextMessage from './ParseTextMessage';

interface ITextMessageProps {
  messageItem: IMessageItem;
  onSelectReplyMessage: (messageItem: IMessageItem) => void;
}

const TextMessage = React.memo(({messageItem, onSelectReplyMessage}: ITextMessageProps) => {
  const message = messageItem.data as ITextMessage;

  return (
    <BaseMessage onSelectReplyMessage={onSelectReplyMessage} messageItem={messageItem}>
      <ParseTextMessage text={message.text} />
    </BaseMessage>
  );
});

const styles = StyleSheet.create({});

export default TextMessage;
