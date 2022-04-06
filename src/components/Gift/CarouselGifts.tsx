import React, {useMemo} from 'react';
import {ListRenderItemInfo, StyleSheet} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import IGift from '../../typings/IGift';
import GiftFullItem from './GiftFullItem';
import {sizes} from '../../context/ThemeContext';
import {IWishlist} from '../../typings/IWishlist';
import {IUser} from '../../typings/IUser';

interface ICarouselGiftsProps {
  selectedIndex: number;
  wishlist?: IWishlist;
  setSelected: (n: number) => void;
  owner?: IUser;
  gifts?: IGift[];
}
const itemWidth = responsiveScreenWidth(85);
const sliderWidth = responsiveScreenWidth(100);

const CarouselGifts = ({wishlist, selectedIndex, setSelected, owner, gifts}: ICarouselGiftsProps) => {
  const items = wishlist?.gifts ?? gifts;

  return (
    <Carousel
      removeClippedSubviews={false}
      loop={items.length > 3 ? true : false}
      initialNumToRender={selectedIndex}
      getItemLayout={(data, index) => {
        return {offset: itemWidth * index, length: itemWidth, index};
      }}
      onBeforeSnapToItem={(slideIndex) => {
        setSelected(slideIndex);
      }}
      keyExtractor={(item, index) => item._id + index}
      firstItem={selectedIndex}
      data={items}
      contentContainerCustomStyle={styles.contentContainerCustomStyle}
      inactiveSlideOpacity={0.2}
      inactiveSlideScale={0.9}
      slideStyle={styles.slideStyle}
      activeSlideAlignment="center"
      sliderWidth={sliderWidth}
      itemWidth={itemWidth}
      renderItem={(data: ListRenderItemInfo<IGift>) => {
        const user = typeof data.item.user === 'string' ? undefined : data.item.user;

        return (
          <GiftFullItem
            owner={owner ?? user}
            wishlist={wishlist}
            key={data.item._id}
            styleCon={{marginHorizontal: -sizes[5]}}
            gift={data.item}
          />
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  contentContainerCustomStyle: {
    marginTop: sizes[15],
    flexGrow: 1,
  },
  slideStyle: {},
});

export default CarouselGifts;
