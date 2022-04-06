import React, {useCallback, useEffect, useState} from 'react';
import {AppState, RefreshControl, SafeAreaView, StyleSheet, View} from 'react-native';
import {responsiveScreenHeight, responsiveScreenWidth} from 'react-native-responsive-dimensions';
import {useFocusEffect, useIsFocused, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {WishlistInteractScreenNavigationProp, WishlistInteractScreenProps} from '../../navigators/Invisible.navigator';
import {sizes, useTheme} from '../../../context/ThemeContext';
import IconButton from '../../controls/IconButton';
import TypeView from '../../../typings/TypeView';
import GiftItem from '../../Gift/GiftItem';
import Icon from '../../common/Icons';
import MyText from '../../controls/MyText';
import {getFontFamily} from '../../../utils/getFontFamily';
import MyButton from '../../controls/MyButton';
import RadioButton from '../../controls/RadioButton';
import ModalDeleteWishlist from '../../Modals/ModalDeleteWishlist';
import CustomModalDropdown from '../../controls/Dropdown/CustomModalDropdown';
import {actionsUser, selectorsUser} from '../../../redux/user/userReducer';
import {IWishlist, IWishListLabel} from '../../../typings/IWishlist';
import useDidUpdateEffect from '../../../useHooks/useDidUpdateEffect';
import {actionsOther, selectorsOther} from '../../../redux/other/otherReducer';
import EmptyGifts from '../../EmptyBlocks/EmptyGifts';
import {AutoDragSortableView} from '../../AutoDragSortableView';
import useSharing from '../../../useHooks/useSharing';
import DetailWishlist from '../../common/DetailWishlist';
import t from '../../../utils/t';
import getHeightDropdown from '../../../utils/getHeightDropdown';
import VisibilityType from '../../../typings/VisibilityType';
import wishListService from '../../../services/wishListService/wishListService';
import {heightTabBarRef} from '../../../utils/navigationRef';

interface IHeaderRightProps {
  onPress: any;
  defaultValue: TypeView;
  wishlist: IWishlist;
  onRemove: any;
}

const parentWidth = responsiveScreenWidth(100);

const HeaderRight = ({onPress, defaultValue, wishlist, onRemove}: IHeaderRightProps) => {
  const {shareWishlist} = useSharing();
  const [isModalDelete, setIsModalDelete] = useState(false);
  const navigation = useNavigation<WishlistInteractScreenNavigationProp>();
  const {text} = useTheme();
  const [typeView, setTypeView] = useState(defaultValue);
  const isGridView = typeView === TypeView.grid;

  const handleChangeView = () => {
    onPress();
    setTypeView((type) => {
      return type === TypeView.grid ? TypeView.list : TypeView.grid;
    });
  };

  const navigateToAddWishlist = () => {
    navigation.navigate('AdditionalNavigator', {
      screen: 'AddWishlist',
      params: {
        wishlist,
      },
    });
  };

  const onShare = () => {
    shareWishlist(wishlist);
  };

  return (
    <View style={styles.headerView}>
      <ModalDeleteWishlist
        onDelete={onRemove}
        modalVisible={isModalDelete}
        onClose={() => setIsModalDelete(false)}
        idWishlist={wishlist && wishlist._id}
      />
      <IconButton
        style={styles.headerItem}
        onPress={() => setIsModalDelete(true)}
        icon={{
          name: 'TrashIcon',
          fill: text,
          size: sizes[16],
        }}
      />
      <IconButton
        style={styles.headerItem}
        onPress={navigateToAddWishlist}
        icon={{
          name: 'EditIcon',
          fill: text,
          size: sizes[16],
        }}
      />
      <IconButton
        style={styles.headerItem}
        onPress={onShare}
        icon={{
          name: 'ShareIcon',
          fill: text,
          size: sizes[16],
        }}
      />
      <IconButton
        style={styles.headerItem}
        onPress={handleChangeView}
        icon={{
          name: isGridView ? 'ViewListIcon' : 'ViewGridIcon',
          fill: text,
          size: sizes[16],
        }}
      />
    </View>
  );
};

const WishlistInteractScreen = ({navigation, route}: WishlistInteractScreenProps) => {
  const dispatch = useDispatch();
  const {idDefaultWishlist} = route.params;
  const {secondary} = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const ownedWishlists = useSelector(selectorsUser.getOwnedWishlistOptions);
  const [idWishlist, setIdWishlist] = useState(idDefaultWishlist);
  const wishlist = useSelector(selectorsUser.getWishlistById(idWishlist));
  const gifts = useSelector(selectorsUser.getGiftsByWishlist(idWishlist));
  const defaultTypeView = useSelector(selectorsOther.getTypeView('WishlistInteractScreen'));
  const [typeView, setTypeView] = useState(defaultTypeView);
  const [isDetail, setIsDetail] = useState(false);
  const selectedWishlist = ownedWishlists.find((w) => w.value === idWishlist);
  const isGridView = typeView === TypeView.grid;

  const handleChangeView = () => {
    setTypeView((type) => {
      const newType = type === TypeView.grid ? TypeView.list : TypeView.grid;

      dispatch(
        actionsOther.setTypeView({
          name: 'WishlistInteractScreen',
          type: newType,
        }),
      );
      return newType;
    });
  };

  const handleRemoveWishlist = () => {
    if (ownedWishlists.length > 0) {
      let idNew = ownedWishlists[0].value;
      if (idWishlist === idNew && ownedWishlists.length > 1) {
        idNew = ownedWishlists[1].value;
      }
      if (ownedWishlists.length === 1) {
        navigation.navigate('Profile', {});
      }
      setIdWishlist(idNew as string);
      dispatch(actionsUser.removeOwnedWishlist(idWishlist));
    }
  };

  const toggleDetail = () => {
    setIsDetail((d) => !d);
  };

  const navigateGiftInteract = (id: string) => {
    navigation.navigate('InvisibleNavigator', {
      screen: 'GiftInteract',
      params: {
        id,
        currentWishlist: wishlist,
      },
    });
  };

  const navigateToProfile = () => {
    navigation.navigate('MainNavigator', {
      screen: 'Profile',
    });
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await updateWishlist();
    setRefreshing(false);
  }, [idWishlist]);

  const updateWishlist = async () => {
    const res = await wishListService.getWishlistById(idWishlist);
    if (res.success) {
      dispatch(actionsUser.addOwnedWishlist(res.data));
    }
  };

  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, []);

  const _handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'active') {
      updateWishlist();
    }
  };

  useEffect(() => {
    if (wishlist) {
      navigation.setOptions({
        headerRight: () => {
          return (
            <HeaderRight
              onRemove={handleRemoveWishlist}
              onPress={handleChangeView}
              defaultValue={typeView}
              wishlist={wishlist}
            />
          );
        },
        // headerLeftAction: navigateToProfile,
      } as any);
    }
  }, [wishlist, idWishlist, ownedWishlists]);

  useDidUpdateEffect(() => {
    setIdWishlist(idDefaultWishlist);
  }, [idDefaultWishlist]);

  useEffect(() => {
    dispatch(
      actionsOther.setData({
        currentIdWishlist: idWishlist,
      }),
    );
  }, [idWishlist]);

  useEffect(() => {
    return () => {
      dispatch(
        actionsOther.setData({
          currentIdWishlist: null,
        }),
      );
    };
  }, []);

  const numColumns = isGridView ? 2 : 1;
  const heightItem = isGridView ? sizes[190] : sizes[105];

  const sortedGifts = [...gifts].sort((a, b) => {
    if (b.remaining === 0) {
      return -1;
    }
    return b.remaining - a.remaining;
  });

  return (
    <SafeAreaView style={styles.con}>
      <AutoDragSortableView
        refreshControl={
          <RefreshControl
            tintColor={secondary}
            progressBackgroundColor={secondary}
            colors={['white']}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        contentContainerStyle={styles.contentContainerStyle}
        containerStyle={styles.containerStyle}
        dataSource={sortedGifts}
        parentWidth={parentWidth}
        childrenWidth={parentWidth / numColumns - sizes[25]}
        marginChildrenBottom={sizes[5]}
        marginChildrenTop={sizes[5]}
        marginChildrenRight={sizes[5]}
        marginChildrenLeft={sizes[5]}
        childrenHeight={heightItem}
        onDataChange={(data) => {
          if (data.length != gifts.length) {
            // TODO: sortable
            // setGifts(data);
          }
        }}
        delayLongPress={200}
        minOpacity={0.9}
        maxScale={0.9}
        scaleDuration={200}
        renderHeaderView={
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: sizes[10],
              }}>
              <CustomModalDropdown<IWishListLabel>
                label=""
                withoutBorder={true}
                options={ownedWishlists}
                onSelect={(o) => {
                  setIdWishlist(o.value.toString());
                  return true;
                }}
                styleWrapper={{
                  marginBottom: 0,
                }}
                value={selectedWishlist ? selectedWishlist.label.name : ''}
                dropdownStyle={{
                  width: responsiveScreenWidth(100) - sizes[30],
                  height: getHeightDropdown({
                    count: ownedWishlists.length,
                    height: sizes[65],
                  }),
                }}
                textStyle={{
                  fontFamily: getFontFamily(700),
                  fontSize: sizes[16],
                  width: sizes[150],
                }}
                styleRowComponent={styles.touchable}
                renderRow={(d, onPress) => {
                  return (
                    <React.Fragment>
                      <View style={styles.viewTouchable}>
                        <Icon name={d.option.label.icon} size={sizes[25]} />
                        <MyText style={styles.textTouchable}>{d.option.label.name}</MyText>
                      </View>
                      <RadioButton
                        onPress={onPress}
                        label=""
                        selected={selectedWishlist ? selectedWishlist.value === d.option.value : false}
                      />
                    </React.Fragment>
                  );
                }}
              />
              <MyButton onPress={toggleDetail} style={styles.btn}>
                {t('details')}
              </MyButton>
            </View>
            {isDetail && <DetailWishlist wishlist={wishlist} />}
            {gifts.length === 0 && (
              <EmptyGifts
                style={{
                  marginTop: sizes[20],
                }}
              />
            )}
          </View>
        }
        onClickItem={(data, item) => navigateGiftInteract(item._id)}
        keyExtractor={(item) => item._id}
        renderItem={(item) => {
          return (
            <GiftItem
              width={parentWidth / numColumns - sizes[isGridView ? 25 : 40]}
              conStyle={{
                height: heightItem,
              }}
              gift={item}
              isDetail={true}
              isHorizontal={!isGridView}
              isArchived={item.remaining === 0}
            />
          );
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: -sizes[13],
  },
  headerItem: {
    marginHorizontal: sizes[13],
  },
  con: {flex: 1},
  styleConDropdown: {
    zIndex: 100,
    marginHorizontal: sizes[20],
    marginBottom: sizes[10],
  },
  styleLabelDropdown: {
    fontFamily: getFontFamily(700),
    fontSize: sizes[16],
  },
  touchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: sizes[20],
  },
  viewTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textTouchable: {fontFamily: getFontFamily(500), marginLeft: sizes[10], maxWidth: responsiveScreenWidth(50)},
  btn: {
    width: sizes[120],
    zIndex: 200,
    paddingVertical: sizes[7],
  },
  bold: {
    fontFamily: getFontFamily(700),
    marginBottom: sizes[4],
  },
  contentContainerStyle: {
    paddingHorizontal: sizes[15],
    paddingBottom: heightTabBarRef.current,
    flexGrow: 1,
  },
  containerStyle: {
    // flex: 1,
  },
});
export default WishlistInteractScreen;
