import React from 'react';
import t from '../../utils/t';
import EmptyBlock from './EmptyBlock';

interface IEmptyWishlistProps {}

const EmptyFollowed = ({}: IEmptyWishlistProps) => {
  return <EmptyBlock texts={[t('textSubscribeToWishlist')]} />;
};

export default EmptyFollowed;
