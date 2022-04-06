import React, {Component} from 'react';
import {NativeSyntheticEvent, NativeScrollEvent, StyleProp, ViewStyle} from 'react-native';

interface IProps {
  dataSource: any[];
  parentWidth: number;
  childrenHeight: number;
  childrenWidth: number;

  marginChildrenTop?: number;
  marginChildrenBottom?: number;
  marginChildrenLeft?: number;
  marginChildrenRight?: number;

  sortable?: boolean;

  onClickItem?: (data: any[], item: any, index: number) => void;
  onDragStart?: (fromIndex: number) => void;
  onDragEnd?: (fromIndex: number, toIndex: number) => void;
  onDataChange?: (data: any[]) => void;
  renderItem: (item: any, index: number) => React.ReactElement<any>;
  scaleStatus?: 'scale' | 'scaleX' | 'scaleY';
  fixedItems?: number[];
  keyExtractor?: (item: any, index: number) => any;
  delayLongPress?: number;
  isDragFreely?: boolean;
  onDragging?: (gestureState: any, left: number, top: number, moveToIndex: number) => void;

  maxScale?: number;
  minOpacity?: number;
  scaleDuration?: number;
  slideDuration?: number;
  refreshControl?: any;
}

interface AutoIProps extends IProps {
  contentContainerStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  autoThrottle?: number;
  autoThrottleDuration?: number;
  renderHeaderView?: any;
  headerViewHeight?: number;
  scrollIndicatorInsets?: {top: number; left: number; bottom: number; right: number};
  renderBottomView?: any;
  bottomViewHeight?: number;
  onScrollListener?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onScrollRef?: (ref: any) => void;
}

declare class AutoDragSortableView extends Component<AutoIProps> {}

export {AutoDragSortableView};
