import React from 'react';
import {IEvent} from '../../typings/IEvent';
import Carousel from 'react-native-snap-carousel';
import {ListRenderItemInfo, StyleSheet} from 'react-native';
import InvitedEvent from './InvitedEvent';
import {sizes} from '../../context/ThemeContext';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';

interface ICarouselEventsProps {
  events: IEvent[];
}

const itemWidth = responsiveScreenWidth(100);
const sliderWidth = responsiveScreenWidth(100);

const CarouselEvents = ({events}: ICarouselEventsProps) => {
  if (events.length === 0) {
    return null;
  }
  return (
    <Carousel
      removeClippedSubviews={true}
      loop={false}
      initialNumToRender={0}
      getItemLayout={(data, index) => {
        return {offset: itemWidth * index, length: itemWidth, index};
      }}
      keyExtractor={(item, index) => item._id + index}
      firstItem={0}
      data={events}
      style={{}}
      contentContainerCustomStyle={styles.contentContainerCustomStyle}
      inactiveSlideOpacity={0.2}
      inactiveSlideScale={0.8}
      activeSlideAlignment="center"
      sliderWidth={sliderWidth}
      itemWidth={itemWidth}
      renderItem={(data: ListRenderItemInfo<IEvent>) => {
        const event = data.item;

        return <InvitedEvent event={event} key={event._id} conStyle={styles.eventBlock} />;
      }}
    />
  );
};

const styles = StyleSheet.create({
  contentContainerCustomStyle: {
    flexGrow: 1,
    marginTop: sizes[20],
    paddingBottom: sizes[20],
  },
  eventBlock: {
    marginHorizontal: sizes[20],
  },
});

export default CarouselEvents;
