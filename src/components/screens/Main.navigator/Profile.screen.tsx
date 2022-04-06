import {Platform, ScrollView, RefreshControl, StyleSheet, View, ActivityIndicator} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Transition, Transitioning, TransitioningView} from 'react-native-reanimated';
import {useDispatch, useSelector} from 'react-redux';
import {ProfileScreenProps} from '../../navigators/Main.navigator';
import {sizes, useTheme} from '../../../context/ThemeContext';
import ModalProfile from '../../Modals/ModalProfile';
import MyProfileBlock from '../../Profile/MyProfileBlock';
import IOption from '../../../typings/IOption';
import VerticalTabs from '../../common/VerticalTabs';
import ShadowWrapper from '../../common/ShadowWrapper';
import TabContentFollowed from '../../common/TabContentFollowed';
import TabContentWishlist from '../../common/TabContentWishlist';
import authService from '../../../services/authService/authService';
import {actionsUser} from '../../../redux/user/userReducer';
import {actionsOther, selectorsOther} from '../../../redux/other/otherReducer';
import t from '../../../utils/t';
import {responsiveScreenHeight} from 'react-native-responsive-dimensions';
import MyModal from '../../Modals/MyModal';
import ModalLoadingScreen from '../../Modals/ModalLoadingScreen';

const ProfileScreen = ({navigation}: ProfileScreenProps) => {
  const options = useMemo(() => {
    return [
      {
        label: t('myWishlists'),
        value: 0,
      },
      {
        label: t('followed'),
        value: 1,
      },
    ] as IOption<string, any>[];
  }, []);
  const dispatch = useDispatch();
  const ref = React.useRef<TransitioningView | null>(null);
  const refScroll = useRef();
  const refPointScroll = useRef(0);
  const {background, secondary} = useTheme();
  const defaultSelected = useSelector(selectorsOther.getSelectedTab);
  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState(defaultSelected ?? options[0]);

  const handleSelect = (opt: any) => {
    dispatch(
      actionsOther.setData({
        selectedTab: opt,
      }),
    );
    setSelected(opt);
    ref.current?.animateNextTransition();
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    const res = await authService.getProfile();
    if (res.success) {
      dispatch(actionsUser.setUser(res.data![0]));
    }
    setRefreshing(false);
  }, []);

  const handlePressWishlist = () => {
    refScroll.current.scrollTo({
      y: refPointScroll.current,
      animated: true,
    });
  };

  const isFirstItem = selected.value === options[0].value;
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        ref={refScroll}
        style={styles.style}
        contentContainerStyle={styles.contentContainerStyle}
        refreshControl={
          <RefreshControl
            tintColor={secondary}
            progressBackgroundColor={secondary}
            colors={['white']}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        showsVerticalScrollIndicator={false}
        bounces={true}>
        <ShadowWrapper style={styles.shadow}>
          <View style={[styles.top, {backgroundColor: background}]}>
            <ModalProfile />
            <MyProfileBlock onPressWishlist={handlePressWishlist} />
          </View>
        </ShadowWrapper>
        <View
          onLayout={(e) => {
            refPointScroll.current = e.nativeEvent.layout.y;
          }}>
          <VerticalTabs
            style={{marginHorizontal: sizes[20]}}
            options={options}
            select={selected}
            setOption={handleSelect}
          />
          <Transitioning.View ref={ref} transition={transition}>
            {isFirstItem ? <TabContentWishlist key={1} /> : <TabContentFollowed key={2} />}
          </Transitioning.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const transition = (
  <Transition.Together>
    <Transition.Out type="fade" durationMs={500} />
    <Transition.Change interpolation="easeInOut" />
    <Transition.In type="fade" durationMs={500} delayMs={250} />
  </Transition.Together>
);

const styles = StyleSheet.create({
  container: {},
  svg: {},
  text: {
    fontSize: sizes[16],
    marginRight: sizes[10],
  },
  btnProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 0 : sizes[15],
  },
  top: {
    paddingHorizontal: sizes[20],
  },
  shadow: {
    shadowColor: 'rgb(141, 155, 167)',
    shadowOffset: {
      width: 0,
      height: sizes[26],
    },
    shadowOpacity: 0.1,
    shadowRadius: sizes[24],
  },
  style: {
    height: responsiveScreenHeight(96),
  },
  contentContainerStyle: {
    paddingBottom: responsiveScreenHeight(4),
  },
});
export default ProfileScreen;
