import IOption from '../typings/IOption';
import {IWishListLabel} from '../typings/IWishlist';

const wishList: IOption<IWishListLabel>[] = [
  {
    value: 1,
    label: {
      name: 'Birthday party',
      icon: 'BalloonCoverIcon',
    },
  },
  {
    value: 2,
    label: {
      name: 'Birthday party 2',
      icon: 'HouseCoverIcon',
    },
  },
  {
    value: 3,
    label: {
      name: 'Birthday party 3',
      icon: 'StarCoverIcon',
    },
  },
];

export default wishList;
