import React, {useRef, useState} from 'react';
import {Dimensions} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {IWishlist} from '../../typings/IWishlist';
import ShareAddGift from './ShareAddGift';
import ShareAddWishlist from './ShareAddWishlist';

const width = Dimensions.get('screen').width;
interface IShareViewProps {
  data?: string;
  mimeType?: string;
  onDismissExtension: any;
  onContinueInApp?: (data?: any) => any;
}

const ShareView = (props: IShareViewProps) => {
  const refScroll = useRef<any>();
  const [addedWishlist, setAddedWishlist] = useState<IWishlist[]>([]);
  const [index, setIndex] = useState(0);
  const [userName, setUserName] = useState('');

  const handleScroll = (index: number) => {
    refScroll.current!.scrollTo({x: index * width, animated: true});
    setIndex(index);
  };

  return (
    <ScrollView
      decelerationRate={0.1}
      ref={refScroll}
      nestedScrollEnabled={true}
      horizontal={true}
      onScroll={(e) => {
        if (e.nativeEvent.contentOffset.x === 0) {
          setIndex(0);
        }
      }}
      snapToInterval={width}
      scrollEnabled={index !== 0}
      contentContainerStyle={{}}
      style={{}}>
      <ShareAddGift
        addedWishlist={addedWishlist}
        scrollToWishlist={() => handleScroll(1)}
        setUserName={setUserName}
        {...props}
      />
      <ShareAddWishlist userName={userName} scrollToGift={() => handleScroll(0)} setAddedWishlist={setAddedWishlist} />
    </ScrollView>
  );
};

export default ShareView;
