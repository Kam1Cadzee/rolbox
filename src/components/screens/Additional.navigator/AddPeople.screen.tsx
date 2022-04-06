import React from 'react';
import {AddPeopleScreenProps} from '../../navigators/Additional.navigator';
import {useSelector} from 'react-redux';
import {selectorsUser} from '../../../redux/user/userReducer';
import {IUser} from '../../../typings/IUser';
import SelectUsers from '../../common/SelectUsers';

const AddPeopleScreen = ({navigation, route}: AddPeopleScreenProps) => {
  const defaultPeople = route.params.people;
  const friends = useSelector(selectorsUser.getFriends);

  const handleSubmit = (users: IUser[]) => {
    navigation.navigate('AdditionalNavigator', {
      screen: 'AddWishlist',
      params: {
        updatedPeople: users,
      },
    });
  };

  return <SelectUsers onSubmit={handleSubmit} defaultSelectableUsers={defaultPeople} users={friends} />;
};

export default AddPeopleScreen;
