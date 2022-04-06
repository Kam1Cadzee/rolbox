import React, {useEffect, useState} from 'react';
import {ShareMenuReactView} from 'react-native-share-menu';
import {parseHttpString} from '../../utils/isHttp';
import ShareView from './ShareView';

const ShareIOS = () => {
  const [sharedData, setSharedData] = useState<string>();
  const [sharedMimeType, setSharedMimeType] = useState<string>();

  useEffect(() => {
    ShareMenuReactView.data()
      .then(({mimeType, data}) => {
        const http = parseHttpString(data);

        setSharedData(http ?? 'none');
        setSharedMimeType(mimeType || 'none');
      })
      .catch(() => {
        setSharedData('none');
        setSharedMimeType('none');
      });
  }, []);

  const handleDismissExtension = () => {
    ShareMenuReactView.dismissExtension();
  };

  const handleContinueInApp = (data?: any) => {
    ShareMenuReactView.continueInApp(data);
  };

  return (
    <ShareView
      data={sharedData}
      mimeType={sharedMimeType}
      onContinueInApp={handleContinueInApp}
      onDismissExtension={handleDismissExtension}
    />
  );
};

export default ShareIOS;
