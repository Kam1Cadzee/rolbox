import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useModal, TypeModal} from '../../context/ModalContext';
import SentryCrash from '../../Crashlytics/Sentry';
import {selectorsConfig} from '../../redux/config/configReducer';
import useDidUpdateEffect from '../../useHooks/useDidUpdateEffect';
import loadRemoteConfig from '../../utils/loadRemoteConfig';
import {updateTranslation} from '../../utils/translations';
import validateVersion from '../../utils/validateVersion';
import {CheckAndroidVersion} from '../../config/configVersion';
import {isAndroid} from '../../utils/isPlatform';
import {actionsOther, selectorsOther} from '../../redux/other/otherReducer';

const UseConfigLoadSetup = React.memo(() => {
  const dispatch = useDispatch();
  const [isLoadConfig, setIsLoadConfig] = useState(false);
  const requiredVersion = useSelector(selectorsConfig.getRequiredVersion);
  const optionalVersion = useSelector(selectorsConfig.getOptionalVersion);
  const enabledRequiredCheck = useSelector(selectorsConfig.getItemConfig('enabledRequiredCheckVersion'));
  const enabledOptionalCheck = useSelector(selectorsConfig.getItemConfig('enabledOptionalCheckVersion'));
  const enabledLoadTranslations = useSelector(selectorsConfig.getItemConfig('enabledLoadTranslations'));
  const androidVersionCheck = useSelector(selectorsOther.getItem('androidVersionCheck'));

  const {executeModal} = useModal();

  useEffect(() => {
    SentryCrash.config();
    loadRemoteConfig(dispatch, false).then(() => {
      setIsLoadConfig(true);
    });
  }, []);

  useDidUpdateEffect(() => {
    if (isLoadConfig) {
      if (!validateVersion(requiredVersion) && enabledRequiredCheck) {
        executeModal({
          type: TypeModal.update,
          payload: true,
          priority: 'high',
        });
      } else if (!validateVersion(optionalVersion) && enabledOptionalCheck) {
        executeModal({
          type: TypeModal.update,
          payload: false,
          priority: 'high',
        });
      } else if (isAndroid) {
        CheckAndroidVersion.check().then((result) => {
          if (androidVersionCheck == result.storeVersion) {
            return;
          }

          dispatch(
            actionsOther.setData({
              androidVersionCheck: result.storeVersion,
            }),
          );
          if (result.shouldUpdate) {
            executeModal({
              type: TypeModal.update,
              payload: false,
              priority: 'high',
            });
          }
        });
      }
    }
  }, [isLoadConfig]);

  useDidUpdateEffect(() => {
    if (enabledLoadTranslations === null) {
      return;
    }
    if (enabledLoadTranslations) {
      updateTranslation();
    }
  }, [enabledLoadTranslations]);

  return null;
});

export default UseConfigLoadSetup;
