import React, {useRef, useState} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {sizes, useTheme} from '../../context/ThemeContext';
import {IMessageItem} from '../../typings/IMessage';
import ShadowWrapper from '../common/ShadowWrapper';
import IconButton from '../controls/IconButton';
import ReplyMessage from './ReplyMessage';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
import ImagePicker, {ImageOrVideo} from 'react-native-image-crop-picker';
import {isIOS} from '../../utils/isPlatform';
import {ImageBuild} from '../../utils/ImageBuild';
import Icon from '../common/Icons';
import {Controller, useForm} from 'react-hook-form';
import TouchableOpacityDelay from '../controls/TouchableOpacityDelay';

interface IMessageInputProps {
  replyMessageItem?: IMessageItem;
  removeReplyMessageItem: any;
  onSendMessage: (message: string, images: ImageOrVideo[]) => Promise<boolean>;
}

const sizeImage = sizes[100];
const sizeCircle = sizeImage / 5;

const imageBuilder = new ImageBuild({
  width: sizeImage,
});
const multiply = 400;

const MessageInput = ({replyMessageItem, removeReplyMessageItem, onSendMessage}: IMessageInputProps) => {
  const [images, setImages] = useState<ImageOrVideo[]>([]);
  const {lightText, secondary, primary, reverseText} = useTheme();
  const refIsLoading = useRef(false);
  const {control, setValue, handleSubmit} = useForm();

  const handleSendMessage = ({message}) => {
    if (refIsLoading.current === true) {
      return;
    }

    const fetchMessage = message.trim();

    if (images.length === 0 && fetchMessage.length === 0) {
      return;
    }

    refIsLoading.current = true;
    setValue('message', '');
    setImages([]);

    onSendMessage(fetchMessage, images);
    refIsLoading.current = false;
  };

  const handleRemoveImage = (index: number) => {
    setImages((images) => {
      return images.filter((img, i) => i !== index);
    });
  };

  const handleAddPicture = () => {
    ImagePicker.openPicker({
      cropping: false,
      cropperCircleOverlay: false,
      avoidEmptySpaceAroundImage: false,
      mediaType: 'photo',
      cropperActiveWidgetColor: secondary,
      cropperStatusBarColor: secondary,
      cropperToolbarColor: secondary,
      cropperToolbarWidgetColor: reverseText,
      width: imageBuilder.PixelW * multiply,
      height: imageBuilder.PixelH * multiply,
      compressImageQuality: 0.8,
      minFiles: 1,
      maxFiles: 4,
      multiple: false,
      showsSelectedCount: true,
      compressImageMaxWidth: (imageBuilder.PixelW * multiply) / 2,
      compressImageMaxHeight: (imageBuilder.PixelH * multiply) / 2,
    }).then((image) => {
      setImages([image]);
    });
  };

  return (
    <ShadowWrapper style={styles.shadow}>
      <View style={styles.con}>
        {images.length > 0 && (
          <ScrollView horizontal={true} style={{paddingBottom: sizes[14]}}>
            {images.map((img, i) => {
              return (
                <View
                  key={i}
                  style={{
                    marginHorizontal: 1,
                  }}>
                  <TouchableOpacityDelay
                    onPress={() => {
                      handleRemoveImage(i);
                    }}
                    style={{
                      position: 'absolute',
                      right: sizes[5],
                      top: sizes[5],
                      zIndex: 11,
                      borderWidth: 1,
                      borderColor: secondary,
                      backgroundColor: secondary,
                      width: sizeCircle,
                      height: sizeCircle,
                      borderRadius: sizeCircle / 2,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Icon name="CloseIcon" size={sizeCircle / 2.5} fill={reverseText} />
                  </TouchableOpacityDelay>
                  <Image
                    resizeMode="cover"
                    source={{
                      uri: img.path,
                    }}
                    style={{
                      width: imageBuilder.Width,
                      height: imageBuilder.Height,
                    }}
                  />
                </View>
              );
            })}
          </ScrollView>
        )}
        {replyMessageItem && <ReplyMessage conStyle={styles.replyMessage} message={replyMessageItem} />}
        {replyMessageItem && (
          <IconButton
            onPress={removeReplyMessageItem}
            style={styles.replyRemove}
            icon={{
              name: 'CrossIcon',
              size: sizes[12],
              fill: primary,
            }}
          />
        )}
        <View style={styles.innerCon}>
          <View
            style={[
              styles.viewTextInput,
              {
                borderColor: lightText,
              },
            ]}>
            <Controller
              control={control}
              render={({onChange, value}) => (
                <TextInput value={value} multiline onChangeText={onChange} style={[styles.textInput, {}]} />
              )}
              name="message"
              defaultValue=""
            />
          </View>

          <IconButton
            onPress={handleAddPicture}
            disabled={refIsLoading.current}
            style={[
              styles.btn,
              {
                borderColor: lightText,
                borderWidth: 1,
              },
            ]}
            icon={{
              name: 'ImagesIcon',
              fill: lightText,
              size: sizes[17],
            }}
          />
          <IconButton
            onPress={handleSubmit(handleSendMessage)}
            disabled={refIsLoading.current}
            style={[
              styles.btn,
              styles.shadowBtn,
              {
                backgroundColor: secondary,
              },
            ]}
            icon={{
              name: 'MessageIcon',
              fill: reverseText,
              size: sizes[17],
            }}
          />
        </View>
      </View>
    </ShadowWrapper>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: 'rgb(141, 155, 167)',
    shadowOffset: {
      width: 0,
      height: -sizes[16],
    },
    shadowOpacity: 0.2,
    shadowRadius: sizes[40],
  },
  con: {
    backgroundColor: '#FCFEFF',
    paddingHorizontal: sizes[20],
    paddingVertical: sizes[14],
  },
  replyMessage: {
    marginBottom: sizes[10],
    width: '75%',
  },
  replyRemove: {
    position: 'absolute',
    right: sizes[70],
    top: sizes[20],
  },
  innerCon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewTextInput: {
    borderWidth: 1,
    borderRadius: sizes[20],
    paddingHorizontal: sizes[16],
    paddingVertical: isIOS ? sizes[12] : undefined,
    width: '74%',
  },
  textInput: {
    maxHeight: sizes[80],
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    alignContent: 'center',
  },
  btn: {
    width: sizes[40],
    height: sizes[40],
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: sizes[20],
    marginLeft: sizes[5],
  },
  shadowBtn: {
    shadowColor: 'rgb(118, 105, 103)',
    shadowOffset: {
      width: 0,
      height: sizes[1],
    },
    shadowOpacity: 0.5,
    shadowRadius: sizes[2],
    elevation: 4,
  },
});
export default MessageInput;
