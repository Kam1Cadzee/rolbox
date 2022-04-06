import React, {useMemo} from 'react';
import {StyleProp, TouchableOpacity, StyleSheet, View, ViewStyle} from 'react-native';
import {sizes} from '../../context/ThemeContext';
import {IBaseMessage, IImageMessage, IMessageItem, PositionMessage, TypeMessage} from '../../typings/IMessage';
import BaseMessage, {areEqualMessageItemProps, MEASURES_CHATS, PALETTE, STYLES_RADIUS_MESSAGE} from './BaseMessage';
import FastImage from 'react-native-fast-image';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import {TypeModal, useModal} from '../../context/ModalContext';
import ParseTextMessage from './ParseTextMessage';

interface IImageMessageProps {
  messageItem: IMessageItem;
  onSelectReplyMessage: (messageItem: IMessageItem) => void;
}

const percentWidth = 70;

const sizeSquare = Math.floor(responsiveScreenWidth(percentWidth) / 24);

const getLayout = (n: number) => {
  switch (n) {
    case 1:
      return [{x: 24, y: 24}];
    case 2:
      return [
        {x: 12, y: 12},
        {x: 12, y: 12, offsetX: 12},
      ];
    case 3:
      return [
        {x: 12, y: 24},
        {x: 12, y: 12, offsetX: 12},
        {x: 12, y: 12, offsetX: 12, offsetY: 12},
      ];
    case 4:
      return [
        {x: 12, y: 12},
        {x: 12, y: 12, offsetX: 12},
        {x: 12, y: 12, offsetY: 12},
        {x: 12, y: 12, offsetX: 12, offsetY: 12},
      ];
    case 5:
      return [
        {x: 8, y: 12},
        {x: 8, y: 12, offsetX: 8},
        {x: 8, y: 12, offsetX: 16},
        {x: 12, y: 12, offsetY: 12},
        {x: 12, y: 12, offsetX: 12, offsetY: 12},
      ];
    case 6:
      return [
        {x: 8, y: 12},
        {x: 8, y: 12, offsetX: 8},
        {x: 8, y: 12, offsetX: 16},
        {x: 8, y: 12, offsetY: 12},
        {x: 8, y: 12, offsetX: 8, offsetY: 12},
        {x: 8, y: 12, offsetX: 16, offsetY: 12},
      ];
    case 7:
      return [
        {x: 6, y: 10},
        {x: 6, y: 10, offsetX: 6},
        {x: 6, y: 10, offsetX: 12},
        {x: 6, y: 10, offsetX: 18},
        {x: 8, y: 14, offsetY: 10},
        {x: 8, y: 14, offsetX: 8, offsetY: 10},
        {x: 8, y: 14, offsetX: 16, offsetY: 10},
      ];
  }
};

const getFastImagesSize = (n: number) => {
  if (n === 2) {
    return {
      w: sizeSquare * 24,
      h: sizeSquare * 12,
    };
  }

  return {
    w: sizeSquare * 24,
    h: sizeSquare * 24,
  };
};

const getStyles = (message: IBaseMessage, style: StyleProp<ViewStyle>) => {
  const isText = !!(message as any).text;

  if (message.isMine) {
    if (message.position === PositionMessage.start) {
      const res = [style, STYLES_RADIUS_MESSAGE.conMine, STYLES_RADIUS_MESSAGE.conMineStart];
      if (isText) {
        res.push({
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        });
      }
      return res;
    } else if (message.position === PositionMessage.middle) {
      const res = [style, STYLES_RADIUS_MESSAGE.conMine];

      if (isText) {
        res.push({
          borderTopLeftRadius: 0,
        });
      }
      return res;
    } else if (message.position === PositionMessage.end) {
      const res = [style, STYLES_RADIUS_MESSAGE.conMine, STYLES_RADIUS_MESSAGE.conMineEnd];
      if (isText) {
        res.push({
          borderTopLeftRadius: 0,
        });
      }
      return res;
    }
  } else {
    if (message.position === PositionMessage.start) {
      return [
        style,
        STYLES_RADIUS_MESSAGE.con,
        STYLES_RADIUS_MESSAGE.conStart,
        {
          borderTopRightRadius: 0,
          borderTopLeftRadius: 0,
        },
      ];
    } else if (message.position === PositionMessage.middle) {
      return [
        style,
        STYLES_RADIUS_MESSAGE.con,
        {
          borderTopRightRadius: 0,
        },
      ];
    } else if (message.position === PositionMessage.end) {
      return [
        style,
        STYLES_RADIUS_MESSAGE.conEnd,
        STYLES_RADIUS_MESSAGE.con,
        {
          borderTopRightRadius: 0,
        },
      ];
    }
  }
};

const ImageMessage = React.memo(({messageItem, onSelectReplyMessage}: IImageMessageProps) => {
  const message = messageItem.data as IImageMessage;
  const images = message.images.filter((_, i) => i < 4);
  const {executeModal} = useModal();

  const actions = useMemo(() => {
    const res = [] as any[];

    if (messageItem.type === TypeMessage.image) {
      res.push({
        title: 'Review', //TODO:
        systemIcon: 'eye',
        onPress: () => {
          executeModal({
            priority: 'high',
            type: TypeModal.previewImages,
            payload: {
              images,
              index: 0,
            },
          });
        },
      });
    }
    return res;
  }, [messageItem]);

  const {layout, h, w} = useMemo(() => {
    const res = getLayout(images.length);
    const {h, w} = getFastImagesSize(images.length);
    return {
      layout: res,
      h,
      w,
    };
  }, [message]);

  if (message.images.length === 0) {
    return null;
  }

  return (
    <BaseMessage
      onSelectReplyMessage={onSelectReplyMessage}
      isShowName={true}
      nameStyle={{
        maxWidth: responsiveScreenWidth(percentWidth),
        paddingHorizontal: MEASURES_CHATS.paddingH,
      }}
      messageItem={messageItem}
      extraActions={actions}
      conStyle={messageItem.data.isMine ? styles.conMine : styles.con}>
      {!!message.text && <ParseTextMessage styleText={styles.text} text={message.text} />}

      <View
        style={getStyles(messageItem.data, {
          width: w,
          height: h,
          overflow: 'hidden',
        })}>
        {images.map((img, index) => {
          const l = layout[index];

          const width = l.x * sizeSquare;
          const height = l.y * sizeSquare;
          const offsetX = (l.offsetX ?? 0) * sizeSquare;
          const offsetY = (l.offsetY ?? 0) * sizeSquare;

          return (
            <TouchableOpacity
              onPress={() => {
                executeModal({
                  priority: 'high',
                  type: TypeModal.previewImages,
                  payload: {
                    images,
                    index,
                  },
                });
              }}
              onLongPress={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              style={{
                position: 'absolute',
                top: offsetY,
                left: offsetX,
              }}>
              <FastImage
                key={index}
                resizeMode="cover"
                style={{
                  width,
                  height,
                }}
                source={{
                  uri: img.url,
                  cache: 'immutable',
                  priority: 'low',
                }}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </BaseMessage>
  );
}, areEqualMessageItemProps);

const styles = StyleSheet.create({
  con: {
    paddingBottom: 0,
    paddingHorizontal: 0,
    borderColor: PALETTE.BG_COLOR,
  },
  conMine: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 0,
    borderColor: PALETTE.MINE_BG_COLOR,
  },
  text: {
    width: responsiveScreenWidth(percentWidth - 5),
    paddingLeft: MEASURES_CHATS.paddingH,
    paddingVertical: MEASURES_CHATS.paddingH / 2,
  },
});

export {getFastImagesSize};
export default ImageMessage;
