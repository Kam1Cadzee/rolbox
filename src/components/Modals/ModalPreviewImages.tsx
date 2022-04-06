import React from 'react';
import {IImage} from '../../typings/IUser';
import {ListRenderItemInfo, Modal, SafeAreaView, StyleSheet, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Portal} from 'react-native-portalize';
import {sizes, useTheme} from '../../context/ThemeContext';
import Carousel from 'react-native-snap-carousel';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import FastImage from 'react-native-fast-image';
import IconButton from '../controls/IconButton';

interface IModalPreviewImagesProps {
  modalVisible: boolean;
  onClose: any;
  images: IImage[];
  initIndex: number;
}

const ModalPreviewImages = ({images, modalVisible, initIndex, onClose}: IModalPreviewImagesProps) => {
  const {text, reverseText, background} = useTheme();

  if (!modalVisible) {
    return null;
  }

  return (
    <Portal>
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <GestureHandlerRootView style={{flex: 1}}>
          <SafeAreaView
            style={{
              flexGrow: 1,
              backgroundColor: 'black',
            }}>
            <View style={[styles.centeredView]}>
              <IconButton
                onPress={onClose}
                style={{
                  position: 'absolute',
                  right: sizes[10],
                  top: sizes[10],
                  zIndex: 99999,
                  backgroundColor: text,
                  width: sizes[30],
                  height: sizes[30],
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: sizes[20],
                }}
                icon={{
                  name: 'CrossIcon',
                  fill: background,
                  size: sizes[10],
                }}
              />
              <PreviewImages images={images} initIndex={initIndex} />
            </View>
          </SafeAreaView>
        </GestureHandlerRootView>
      </Modal>
    </Portal>
  );
};

interface IPreviewImagesProps {
  images: IImage[];
  initIndex: number;
}

const itemWidth = responsiveScreenWidth(100);
const sliderWidth = responsiveScreenWidth(100);

const PreviewImages = ({images, initIndex}: IPreviewImagesProps) => {
  return (
    <Carousel
      removeClippedSubviews={false}
      loop={images.length > 3 ? true : false}
      initialNumToRender={initIndex}
      getItemLayout={(data, index) => {
        return {offset: itemWidth * index, length: itemWidth, index};
      }}
      keyExtractor={(item, index) => item.url}
      firstItem={initIndex}
      data={images}
      contentContainerCustomStyle={styles.contentContainerCustomStyle}
      inactiveSlideOpacity={0.7}
      inactiveSlideScale={0.9}
      slideStyle={styles.slideStyle}
      activeSlideAlignment="center"
      sliderWidth={sliderWidth}
      itemWidth={itemWidth}
      renderItem={(data: ListRenderItemInfo<IImage>) => {
        const image = data.item;

        return (
          <FastImage
            resizeMode="contain"
            style={{
              width: itemWidth,
              height: '100%',
            }}
            source={{
              uri: image.url,
              cache: 'immutable',
              priority: 'low',
            }}
          />
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainerCustomStyle: {
    height: '100%',
  },
  slideStyle: {},
});

export default ModalPreviewImages;
