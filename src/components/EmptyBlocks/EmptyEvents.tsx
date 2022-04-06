import React from 'react';
import t from '../../utils/t';
import EmptyBlock from './EmptyBlock';

interface IEmptyEventsProps {}

const EmptyEvents = ({}: IEmptyEventsProps) => {
  return <EmptyBlock texts={[t('emptyEventsBlock')]} />;
};

export default EmptyEvents;
