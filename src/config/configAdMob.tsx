import admob, {
  AdsConsent,
  AdsConsentDebugGeography,
  AdsConsentStatus,
  MaxAdContentRating,
  TestIds,
  FirebaseAdMobTypes,
  InterstitialAd,
} from '@react-native-firebase/admob';
import {useEffect, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {TypeModal, useModal} from '../context/ModalContext';
import {actionsOther, selectorsOther} from '../redux/other/otherReducer';
import {isIOS} from '../utils/isPlatform';
import config, {mode, Mode} from './configMode';

const testDevices = [
  '6E9399B6-96A0-4190-B75D-03A3414E57B0',
  '42b6f4c3-d3d7-4b5e-8876-4860fa75c983',
  '4d64a676-d7a0-495d-8c05-f244e1da3487',
];

const configAdMob = (() => {
  // TODO: remote config
  const modesForTest = [Mode.DEV, Mode.LOCAL, Mode.UAT];

  if (modesForTest.some((m) => m === mode)) {
    return {
      BANNER: TestIds.BANNER,
      INTERSTITIAL: TestIds.INTERSTITIAL,
      REWARDED: TestIds.REWARDED,
    };
  }
  const keyAdMob = isIOS ? config.admobIOS : config.admobAndroid;
  return {
    BANNER: keyAdMob,
    INTERSTITIAL: keyAdMob,
    REWARDED: keyAdMob,
  };
})();

const configurationAdMob = async () => {
  await admob().setRequestConfiguration({
    maxAdContentRating: MaxAdContentRating.G,
    tagForChildDirectedTreatment: true,
    tagForUnderAgeOfConsent: true,
  });
};

const RequestAgreementAdMob = () => {
  const dispatch = useDispatch();
  const countProvidersAdMob = useSelector(selectorsOther.getCountProvidersAdMob);
  const countPublishersAdMob = useSelector(selectorsOther.getCountPublishersAdMob);
  const {executeModal} = useModal();

  const handleSetStatus = async (status: 0 | 1 | 2) => {
    await AdsConsent.setStatus(status);
    if (status === 0) {
      dispatch(
        actionsOther.setData({
          statusAdMob: 'UNKNOWN',
        }),
      );
    } else if (status === 1) {
      dispatch(
        actionsOther.setData({
          statusAdMob: 'NON_PERSONALIZED',
        }),
      );
    } else if (status === 2) {
      dispatch(
        actionsOther.setData({
          statusAdMob: 'PERSONALIZED',
        }),
      );
    }
  };

  useEffect(() => {
    const handle = async () => {
      await configurationAdMob();
      const providers = await AdsConsent.getAdProviders();
      const publishers = config.publisherID;

      if (mode === Mode.LOCAL) {
        await AdsConsent.addTestDevices(testDevices);
      }

      if (config.debugAdbmob) {
        await AdsConsent.setStatus(AdsConsentStatus.NON_PERSONALIZED);
        await AdsConsent.setDebugGeography(AdsConsentDebugGeography.EEA);
      }

      if (providers.length !== countProvidersAdMob || publishers.length !== countPublishersAdMob) {
        await AdsConsent.setStatus(AdsConsentStatus.UNKNOWN);
      }

      try {
        await AdsConsent.setTagForUnderAgeOfConsent(false);
        const res = await AdsConsent.requestInfoUpdate(publishers);

        if (res.isRequestLocationInEeaOrUnknown && res.status === AdsConsentStatus.UNKNOWN) {
          executeModal({
            priority: 'high',
            type: TypeModal.adMob,
          });
        } else {
          handleSetStatus(res.status === AdsConsentStatus.UNKNOWN ? AdsConsentStatus.PERSONALIZED : res.status);
        }
        dispatch(
          actionsOther.setData({
            countProvidersAdMob: providers.length,
            countPublishersAdMob: publishers.length,
          }),
        );
      } catch (e) {}
    };
    handle();
  }, []);

  return null;
};

const useCreateInterstitialAd = (options: FirebaseAdMobTypes.RequestOptions = {}) => {
  const status = useSelector(selectorsOther.getStatusAdMob);

  const ad = useMemo(() => {
    const interstitial =
      status === 'UNKNOWN'
        ? null
        : InterstitialAd.createForAdRequest(configAdMob.INTERSTITIAL, {
            ...options,
            requestNonPersonalizedAdsOnly: status === 'NON_PERSONALIZED',
            testDevices,
          });

    return {
      interstitial,
      set adUnitId(str: string) {
        if (status !== 'UNKNOWN') {
          interstitial.adUnitId = str;
        }
      },
      load: () => {
        if (status !== 'UNKNOWN') {
          interstitial.load();
        }
      },
      onAdEvent: (listener: FirebaseAdMobTypes.AdEventListener) => {
        if (status !== 'UNKNOWN') {
          return interstitial.onAdEvent(listener);
        }
        return () => null;
      },
      show: () => {
        if (status !== 'UNKNOWN') {
          interstitial.show();
        }
      },
      get loaded() {
        if (status !== 'UNKNOWN') {
          return interstitial.loaded;
        }
        return false;
      },
    };
  }, [status]);

  return ad;
};

export {configurationAdMob, RequestAgreementAdMob, testDevices, useCreateInterstitialAd};
export default configAdMob;
