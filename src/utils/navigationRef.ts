import React from 'react';

export const isReadyRef: any = React.createRef();

export const navigationRef = React.createRef<any>();
export const currentChatRef: any = React.createRef<any>();
export const lastMessageRef: any = React.createRef<any>();
export const isNeededLoadChatRef: any = React.createRef<any>();
export const dispatchRef: any = React.createRef<any>();
export const getStoreRef: any = React.createRef<any>();
export const userIdRef: any = React.createRef<any>();
export const heightTabBarRef: any = React.createRef<any>();
export const globalDelayPressRef: any = React.createRef<any>();

export function navigate(name: string, params: any) {
  if (isReadyRef.current && navigationRef.current) {
    // Perform navigation if the app has mounted
    navigationRef.current.navigate(name, params);
  } else {
    // You can decide what to do if the app hasn't mounted
    // You can ignore this, or add these actions to a queue you can call later
  }
}
