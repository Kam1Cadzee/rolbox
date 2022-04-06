import React, {useEffect, useState} from 'react';
import ShareExtension from 'react-native-share-extension';
import {parseHttpString} from '../../utils/isHttp';
import ShareView from './ShareView';

const ShareAndroid = () => {
  const [sharedData, setSharedData] = useState<string>();
  const [sharedMimeType, setSharedMimeType] = useState<string>();

  useEffect(() => {
    ShareExtension.data()
      .then(({value, type}) => {
        const data = parseHttpString(value);
        setSharedData(data ?? 'none');
        setSharedMimeType(type || 'none');
      })
      .catch(() => {
        setSharedData('none');
        setSharedMimeType('none');
      });
  }, []);

  const handleDismissExtension = () => {
    ShareExtension.close();
  };

  const handleContinueInApp = (data?: any) => {};

  return (
    <ShareView
      data={sharedData}
      mimeType={sharedMimeType}
      onContinueInApp={handleContinueInApp}
      onDismissExtension={handleDismissExtension}
    />
  );
};

export default ShareAndroid;
