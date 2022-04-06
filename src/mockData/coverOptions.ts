import {IName} from '../components/common/Icons';
import ICoverItem from '../typings/ICoverItem';

const coverOptions: ICoverItem[] = [
  {
    id: 1,
    icon: 'BalloonCoverIcon',
  },
  {
    id: 2,
    icon: 'BottleCoverIcon',
  },
  {
    id: 3,
    icon: 'CakeCoverIcon',
  },
  {
    id: 4,
    icon: 'GiftCoverIcon',
  },
  {
    id: 5,
    icon: 'HeartCoverIcon',
  },
  {
    id: 6,
    icon: 'HouseCoverIcon',
  },
  {
    id: 7,
    icon: 'RingCoverIcon',
  },
  {
    id: 8,
    icon: 'SalutCoverIcon',
  },
  {
    id: 9,
    icon: 'StarCoverIcon',
  },
  {
    id: 10,
    icon: 'StarsCoverIcon',
  },
  {
    id: 11,
    icon: 'TreeCoverIcon',
  },
];

const getCoverOptionByIcon = (icon: IName) => {
  return coverOptions.find((opt) => opt.icon === icon)!;
};

export {getCoverOptionByIcon};
export default coverOptions;
