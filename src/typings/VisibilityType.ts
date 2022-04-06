import t from '../utils/t';
import IOption from './IOption';

enum VisibilityType {
  private = 'private',
  protected = 'protected',
  public = 'public',
  specific = 'specific',
}

interface IPrivateLabel {
  title: string;
  private: string;
}

const useVisibilityOptions = () => {
  return [
    {
      value: VisibilityType.private,
      label: {
        title: t('privacyPrivate'),
        private: t('privacyPrivateType'),
      },
    },
    {
      value: VisibilityType.protected,
      label: {
        title: t('privacyFriends'),
        private: t('privacyFriendsType'),
      },
    },
    {
      value: VisibilityType.public,
      label: {
        title: t('privacyPublic'),
        private: t('privacyPublicType'),
      },
    },
    {
      value: VisibilityType.specific,
      label: {
        title: t('privacySpecific'),
        private: t('privacySpecificType'),
      },
    },
  ] as IOption<IPrivateLabel, VisibilityType>[];
};

const useVisibilityByType = (type: VisibilityType) => {
  const options = useVisibilityOptions();
  return options.find((o) => o.value === type)!;
};

const useVisibilityByTypeFunc = () => {
  const options = useVisibilityOptions();
  return (type: VisibilityType) => {
    return options.find((o) => o.value === type)!;
  };
};

export {useVisibilityOptions, useVisibilityByType, useVisibilityByTypeFunc};
export type {IPrivateLabel};
export default VisibilityType;
