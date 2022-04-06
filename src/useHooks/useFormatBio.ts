import {useSelector} from 'react-redux';
import {useFormattingContext} from '../context/FormattingContext';
import {selectorsUser} from '../redux/user/userReducer';
import IBio from '../typings/IBio';
import {IUser} from '../typings/IUser';
import {Gender, useGetLabelGender} from '../typings/TypeGender';
import {useFormatUnitHeightValue} from '../typings/TypeHeight';
import {MaritalStatus, useGetLabelMaritalStatus} from '../typings/TypeMaritalStatus';
import {useTranslateUnitWeight} from '../typings/TypeWeight';
import {getCountryByKey} from '../utils/getCountries';
import joinWithComma from '../utils/joinWithComma';

const useFormatBio = (user: IUser | null | undefined) => {
  const currentUserId = useSelector(selectorsUser.getUserId);
  const isFriend = useSelector(selectorsUser.checkFriend(user?._id));
  const returnValue: Partial<IBio> = {};
  const {formatDate, currentLocale} = useFormattingContext();
  const tWeight = useTranslateUnitWeight();
  const formatUnitHeightValue = useFormatUnitHeightValue();
  const getLabelGender = useGetLabelGender();
  const getLabelMaritalStatus = useGetLabelMaritalStatus();

  let state = undefined;

  if (user) {
    if (currentUserId === user?._id || isFriend) {
      returnValue.gender = user.gender === Gender.ratherNotSay ? undefined : getLabelGender(user.gender);
      returnValue.size = user.size ?? '';
      returnValue.shoesSize = user.shoeSize ?? '';
      returnValue.maritalStatus =
        user.maritalStatus === MaritalStatus.ratherNotSay ? undefined : getLabelMaritalStatus(user.maritalStatus);

      if (user.birthday && !user.hideBirthday) {
        returnValue.birthday = formatDate(new Date(user.birthday));
      }

      if (user.hobbies) {
        returnValue.hobbies = user.hobbies.join(', ');
      }
      if (user.height) {
        returnValue.height = `${formatUnitHeightValue(user.height.value, user.height.unit)}`;
      }
      if (user.weight) {
        returnValue.weight = `${user.weight.value} ${tWeight(user.weight.unit)}`;
      }

      state = user.state;
    }

    returnValue.location = joinWithComma({
      city: user.city,
      state: state,
      country: getCountryByKey(currentLocale)(user.country),
    });
  }
  return returnValue;
};

export default useFormatBio;
