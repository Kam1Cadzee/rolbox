import React from 'react';
import {StyleSheet} from 'react-native';

import {sizes} from '../../../context/ThemeContext';
import {AddGuestsScreenProps} from '../../navigators/Additional.navigator';
import {useSelector} from 'react-redux';
import {selectorsUser} from '../../../redux/user/userReducer';
import {IUser} from '../../../typings/IUser';
import SelectUsers from '../../common/SelectUsers';

const AddGuestScreen = ({navigation, route}: AddGuestsScreenProps) => {
  const defaultGuests = route.params.guests;
  const friends = useSelector(selectorsUser.getFriends);

  const handleSubmit = (users: IUser[]) => {
    navigation.navigate('AdditionalNavigator', {
      screen: 'AddEvent',
      params: {
        updatedGuests: users,
      },
    });
  };

  return <SelectUsers onSubmit={handleSubmit} defaultSelectableUsers={defaultGuests} users={friends} />;
};

export default AddGuestScreen;
