import React, {useEffect, useMemo, useState} from 'react';
import {StyleSheet, SafeAreaView, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {responsiveScreenHeight, responsiveScreenWidth} from 'react-native-responsive-dimensions';
import {useDispatch, useSelector} from 'react-redux';
import {Transition, Transitioning, TransitioningView} from 'react-native-reanimated';
import {GiftsScreenProps} from '../../navigators/Invisible.navigator';
import {sizes, useTheme} from '../../../context/ThemeContext';
import IconButton from '../../controls/IconButton';
import VerticalTabs from '../../common/VerticalTabs';
import IOption from '../../../typings/IOption';
import GiftItem from '../../Gift/GiftItem';
import TypeView from '../../../typings/TypeView';
import {selectorsUser} from '../../../redux/user/userReducer';
import useDidUpdateEffect from '../../../useHooks/useDidUpdateEffect';
import authService from '../../../services/authService/authService';
import wishListService from '../../../services/wishListService/wishListService';
import IGift from '../../../typings/IGift';
import getIdObj from '../../../utils/getIdObj';
import t from '../../../utils/t';
import {actionsOther, selectorsOther} from '../../../redux/other/otherReducer';
import {StatusGift} from '../../../typings/StatusGift';

interface IHeaderRightProps {
  onPress: any;
  defaultValue: TypeView;
}
const HeaderRight = ({onPress, defaultValue}: IHeaderRightProps) => {
  const {text} = useTheme();
  const [typeView, setTypeView] = useState(defaultValue);
  const isGridView = typeView === TypeView.grid;

  const handleChangeView = () => {
    onPress();
    setTypeView((type) => {
      return type === TypeView.grid ? TypeView.list : TypeView.grid;
    });
  };

  return (
    <IconButton
      onPress={handleChangeView}
      icon={{
        name: isGridView ? 'ViewListIcon' : 'ViewGridIcon',
        fill: text,
        size: sizes[16],
      }}
    />
  );
};

const GiftsScreen = ({navigation}: GiftsScreenProps) => {
  const dispatch = useDispatch();
  const options: IOption<string, StatusGift>[] = useMemo(() => {
    return [
      {
        label: t('active'),
        value: StatusGift.active,
      },
      {
        label: t('archived'),
        value: StatusGift.archived,
      },
    ];
  }, []);
  const [isDisabled, setIsDisabled] = useState(false);
  const ref = React.useRef<TransitioningView | null>(null);
  const defaultTypeView = useSelector(selectorsOther.getTypeView('GiftsScreen'));
  const [typeView, setTypeView] = useState(defaultTypeView);
  const [selected, setSelected] = useState(options[0]);
  const isGridView = typeView === TypeView.grid;
  const giftsActive = useSelector(selectorsUser.getWillGiveGiftsActive);
  const giftsArchived = useSelector(selectorsUser.getWillGiveGiftsArchived);

  const handleChangeView = () => {
    setTypeView((type) => {
      const newType = type === TypeView.grid ? TypeView.list : TypeView.grid;

      dispatch(
        actionsOther.setTypeView({
          name: 'GiftsScreen',
          type: newType,
        }),
      );
      return newType;
    });
  };

  const navigateToGift = async (gift: IGift) => {
    if (isDisabled) {
      return;
    }
    setIsDisabled(true);
    navigation.navigate('InvisibleNavigator', {
      screen: 'WillGifts',
      params: {idGift: gift._id, status: selected.value},
    });
    setIsDisabled(false);
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return <HeaderRight onPress={handleChangeView} defaultValue={typeView} />;
      },
    });
  }, []);

  useDidUpdateEffect(() => {
    ref.current?.animateNextTransition();
  }, [selected]);

  const numColumns = isGridView ? 2 : 1;
  const heightItem = isGridView ? sizes[200] : sizes[105];

  const gifts = selected.value === StatusGift.active ? giftsActive : giftsArchived;

  return (
    <SafeAreaView style={styles.con}>
      <VerticalTabs<string>
        style={{marginHorizontal: sizes[20]}}
        options={options}
        select={selected}
        setOption={setSelected}
      />
      <Transitioning.View ref={ref} transition={transition}>
        <FlatList
          key={`${typeView.toString()}`}
          keyExtractor={(item, index) => index.toString()}
          numColumns={numColumns}
          ListFooterComponent={() => (
            <View
              style={{
                height: sizes[150],
              }}
            />
          )}
          columnWrapperStyle={
            isGridView
              ? {
                  marginHorizontal: -sizes[4],
                  maxWidth: responsiveScreenWidth(100 / numColumns) - sizes[24],
                }
              : undefined
          }
          contentContainerStyle={{
            paddingTop: sizes[20],
            paddingHorizontal: sizes[20],
          }}
          renderItem={(data) => (
            <GiftItem
              key={data.index}
              wrapperStyle={{
                marginHorizontal: isGridView ? sizes[4] : 0,
                marginVertical: sizes[5],
              }}
              conStyle={{
                height: heightItem,
              }}
              isDetail={false}
              isArchived={selected.value === options[1].value}
              gift={data.item}
              isHorizontal={!isGridView}
              onPress={() => navigateToGift(data.item)}
            />
          )}
          data={gifts}
        />
      </Transitioning.View>
    </SafeAreaView>
  );
};

const transition = (
  <Transition.Together>
    <Transition.Out type="fade" durationMs={1000} />
    <Transition.Change interpolation="easeInOut" />
    <Transition.In type="fade" durationMs={1000} />
  </Transition.Together>
);

const styles = StyleSheet.create({
  con: {},
});

export default GiftsScreen;
