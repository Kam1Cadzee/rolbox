import IGift from './IGift';

export default interface IPurchase {
  status: 'reserved' | 'gifted';
  _id: string;
  giver: string;
  receiver: string;
  gift: IGift | string;
  quantity: number;
}
