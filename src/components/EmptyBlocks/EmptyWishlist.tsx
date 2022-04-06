import React from 'react';
import t from '../../utils/t';
import EmptyBlock from './EmptyBlock';

interface IEmptyWishlistProps {}

const EmptyWishlist = ({}: IEmptyWishlistProps) => {
  return <EmptyBlock texts={[t('textCreateFirstWishlist1'), t('textCreateFirstWishlist2')]} />;
};

export default EmptyWishlist;
