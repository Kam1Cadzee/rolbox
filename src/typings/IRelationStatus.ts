import IOption from './IOption';
import t from '../utils/t';

enum RelationStatus {
  noFriends = 'noFriends',
  requested = 'requested',
  friends = 'friends',
  replaying = 'replaying',
}

enum RelationAction {
  accept,
  decline,
  unfriend,
}

interface IRelationStatusData {
  [name: string]: {
    title: string;
    options: IOption<string, RelationAction>[];
  };
}

const useRelationStatusData = (status: RelationStatus) => {
  const data = {
    [RelationStatus.noFriends]: {
      title: t('addFriend'),
      options: [],
    },
    [RelationStatus.requested]: {
      title: t('requested'),
      options: [],
    },
    [RelationStatus.friends]: {
      title: t('areFriends'),
      options: [
        {
          label: t('unfriend'),
          value: RelationAction.unfriend,
        },
      ],
    },
    [RelationStatus.replaying]: {
      title: t('replyToRequest'),
      options: [
        {
          label: t('accept'),
          value: RelationAction.accept,
        },
        {
          label: t('decline'),
          value: RelationAction.decline,
        },
      ],
    },
  } as IRelationStatusData;

  return data[status];
};

export {useRelationStatusData, RelationAction, RelationStatus};
export default RelationStatus;
