import React from 'react';

const icons = {
  GoogleIcon: require('../../assets/svg/google_icon.svg').default,
  FacebookIcon: require('../../assets/svg/facebook_icon.svg').default,
  WelcomeIcon: require('../../assets/svg/welcome_icon.svg').default,
  ProfileIcon: require('../../assets/svg/profile_icon.svg').default,
  FriendsIcon: require('../../assets/svg/friends_icon.svg').default,
  PlusIcon: require('../../assets/svg/plus_icon.svg').default,
  UIcon: require('../../assets/svg/u_icon.svg').default,
  CloseIcon: require('../../assets/svg/close_icon.svg').default,
  GiftIcon: require('../../assets/svg/gift_icon.svg').default,
  ListIcon: require('../../assets/svg/list_icon.svg').default,
  ArrowDownIcon: require('../../assets/svg/arrow_down.svg').default,
  ArrowUpIcon: require('../../assets/svg/arrow_up.svg').default,
  AvatarIcon: require('../../assets/svg/avatar_icon.svg').default,
  ShareIcon: require('../../assets/svg/share_icon.svg').default,
  ArrowLeftIcon: require('../../assets/svg/arrow_left_icon.svg').default,
  ArrowDoubleLeftIcon: require('../../assets/svg/arrow-double-left-icon.svg').default,
  ArrowDoubleRightIcon: require('../../assets/svg/arrow-double-right-icon.svg').default,
  ArrowRightIcon: require('../../assets/svg/arrow_right_icon.svg').default,
  QuantityIcon: require('../../assets/svg/quantity_icon.svg').default,
  ViewGridIcon: require('../../assets/svg/view_grid_icon.svg').default,
  ViewListIcon: require('../../assets/svg/view_list_icon.svg').default,
  CheckIcon: require('../../assets/svg/check_icon.svg').default,
  EditIcon: require('../../assets/svg/edit_icon.svg').default,
  TrashIcon: require('../../assets/svg/trash_icon.svg').default,
  BigPresentIcon: require('../../assets/svg/big_present_icon.svg').default,
  SearchIcon: require('../../assets/svg/search_icon.svg').default,
  EventMenuIcon: require('../../assets/svg/event-menu-icon.svg').default,
  ChatMenuIcon: require('../../assets/svg/chat-menu-icon.svg').default,
  CalendarIcon: require('../../assets/svg/calendar-icon.svg').default,
  CrossIcon: require('../../assets/svg/cross-icon.svg').default,
  GuestsIcon: require('../../assets/svg/guests-icon.svg').default,
  QuestionIcon: require('../../assets/svg/question-icon.svg').default,
  PrivateChatIcon: require('../../assets/svg/private-chat-icon.svg').default,
  ChatIcon: require('../../assets/svg/chat-icon.svg').default,
  MessageIcon: require('../../assets/svg/message-icon.svg').default,
  DoubleCheckIcon: require('../../assets/svg/double-check-icon.svg').default,
  ImagesIcon: require('../../assets/svg/images-icon.svg').default,
  GroupChatIcon: require('../../assets/svg/group-chat-icon.svg').default,
  LockIcon: require('../../assets/svg/lock-icon.svg').default,
  ClockIcon: require('../../assets/svg/clock.svg').default,
  ErrorIcon: require('../../assets/svg/error.svg').default,

  BalloonCoverIcon: require('../../assets/svg/balloon_cover_icon.svg').default,
  BottleCoverIcon: require('../../assets/svg/bottle_cover_icon.svg').default,
  CakeCoverIcon: require('../../assets/svg/cake_cover_icon.svg').default,
  GiftCoverIcon: require('../../assets/svg/gift_cover_icon.svg').default,
  HeartCoverIcon: require('../../assets/svg/heart_cover_icon.svg').default,
  HouseCoverIcon: require('../../assets/svg/house_cover_icon.svg').default,
  RingCoverIcon: require('../../assets/svg/ring_cover_icon.svg').default,
  SalutCoverIcon: require('../../assets/svg/salut_cover_icon.svg').default,
  StarCoverIcon: require('../../assets/svg/star_cover_icon.svg').default,
  StarsCoverIcon: require('../../assets/svg/stars_cover_icon.svg').default,
  TreeCoverIcon: require('../../assets/svg/tree_cover_icon.svg').default,
  AddPictureIcon: require('../../assets/svg/add_picture_icon.svg').default,

  CloudIcon: require('../../assets/svg/cloud_icon.svg').default,
  RocketIcon: require('../../assets/svg/rocket_icon.svg').default,
  ForbiddenIcon: require('../../assets/svg/forbidden-icon.svg').default,
  AddGuestIcon: require('../../assets/svg/add-guest-icon.svg').default,
};
export type IName = keyof typeof icons;

const namesWithStroke: IName[] = ['EventMenuIcon'];
const namesNothing: IName[] = ['PrivateChatIcon'];

const getIcon = (name: IName) => {
  return icons[name];
};

const transformSVGProps = (props: any) => {
  let width = props.size;
  let height = props.size;
  if (props.width) {
    width = props.width;
  }
  if (props.height) {
    height = props.height;
  }
  return {
    ...props,
    width: width * (props.scale || 1),
    height: height * (props.scale || 1),
  };
};

export interface IDesignIconProps {
  name: IName;
  size?: number;
  width?: number | string;
  height?: number | string;
  fill?: string;
  fillOpacity?: number;
  rotation?: number;
  fillRule?: 'nonzero' | 'evenodd';
  stroke?: 'stroke' | string;
  strokeWidth?: number;
  strokeOpacity?: number;
  x?: number;
  y?: number;
  scale?: number;
  origin?: number;
  originX?: number;
  originY?: number;
}

const Icon = React.memo(({name, fill, stroke, ...props}: IDesignIconProps) => {
  const I = getIcon(name);
  const transformedProps = transformSVGProps(props as any);
  const strokeFill = namesWithStroke.some((n) => n === name) ? fill : undefined;
  if (namesNothing.some((n) => n === name)) {
    return <I {...transformedProps} />;
  }
  return <I fill={fill} stroke={stroke ?? strokeFill} {...transformedProps} />;
});

export default Icon;
