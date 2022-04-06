import React, {useCallback, useEffect, useState} from 'react';
import {Dimensions, Image, ListRenderItem, ListRenderItemInfo, StyleSheet, View} from 'react-native';
import CameraRoll, {PhotoIdentifiersPage, PhotoIdentifier} from '@react-native-community/cameraroll';
import MyModal from './MyModal';
import {getFontFamily} from '../../utils/getFontFamily';
import {sizes} from '../../context/ThemeContext';
import {IUploadImage} from '../../services/uploadImage';
import {FlatList} from 'react-native-gesture-handler';
import TouchableOpacityDelay from '../controls/TouchableOpacityDelay';
const {height, width} = Dimensions.get('screen');

interface IModalInfoProps {
  modalVisible: boolean;
  onClose: any;
  selectImage: (image: IUploadImage | null) => void;
}
interface IPageInfo {
  has_next_page: boolean;
  start_cursor?: string;
  end_cursor?: string;
}

const numColumns = 2;
const w = (width - sizes[40]) / numColumns;
const h = height * 0.23;

const ModalPickerPhoto = ({modalVisible, onClose, selectImage}: IModalInfoProps) => {
  const perImages = 4;
  const [dataGallery, setDataGallery] = useState<PhotoIdentifier[]>([] as PhotoIdentifier[]);
  const [pageInfo, setPageInfo] = useState<IPageInfo>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePicker = ({node}: PhotoIdentifier) => {
    selectImage({
      mime: 'image/png',
      path: node.image.uri,
      filename: node.image.filename,
    });
    onClose();
  };

  useEffect(() => {
    if (modalVisible) {
      loadImages();
    }
    return () => {
      setPageInfo(null);
      setDataGallery([]);
    };
  }, [modalVisible]);

  const loadImages = async () => {
    if (isLoading) {
      return;
    }
    if (pageInfo && !pageInfo.has_next_page) {
      return;
    }
    try {
      setIsLoading(true);
      const res = await CameraRoll.getPhotos({
        first: perImages,
        assetType: 'Photos',
        after: pageInfo?.end_cursor,
      });

      setDataGallery((gallery) => {
        return [...gallery, ...res.edges];
      });
      setPageInfo(res.page_info);
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  const keyExtractor = useCallback((info, i) => i.toString(), []);

  const RenderItem = useCallback((info: ListRenderItemInfo<PhotoIdentifier>) => {
    return (
      <TouchableOpacityDelay onPress={() => handlePicker(info.item)}>
        <Image
          key={info.index.toString()}
          style={{
            width: w,
            height: h,
          }}
          source={{
            uri: info.item.node.image.uri,
          }}
          resizeMode={'cover'}
        />
      </TouchableOpacityDelay>
    );
  }, []);

  return (
    <MyModal
      style={{
        width,
      }}
      modalVisible={modalVisible}
      onClose={onClose}
      isClose>
      <FlatList
        decelerationRate={0.1}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 100,
          waitForInteraction: false,
          minimumViewTime: 500,
        }}
        windowSize={5}
        initialNumToRender={perImages}
        maxToRenderPerBatch={perImages}
        updateCellsBatchingPeriod={1000}
        removeClippedSubviews={true}
        style={{
          height: height * 0.4,
        }}
        numColumns={numColumns}
        keyExtractor={keyExtractor}
        data={dataGallery}
        onEndReachedThreshold={0.4}
        onEndReached={() => {
          loadImages();
        }}
        renderItem={RenderItem}
      />
    </MyModal>
  );
};

const styles = StyleSheet.create({
  bold: {
    fontFamily: getFontFamily(700),
  },
});

export default ModalPickerPhoto;
