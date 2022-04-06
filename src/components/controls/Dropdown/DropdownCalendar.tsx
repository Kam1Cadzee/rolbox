import React from 'react';
import {StyleSheet} from 'react-native';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import {sizes, useTheme} from '../../../context/ThemeContext';
import getErrorByObj from '../../../utils/getErrorByObj';
import CalendarControls from '../../Calendar/CalendarControls';
import Icon from '../../common/Icons';
import Dropdown from './Dropdown';

interface IDropdownCalendarProps {
  label: string;
  name: string;
  errors: any;
  isRequired: boolean;
  value?: string;
  date?: Date;
  onChange: any;
}
const DropdownCalendar = ({errors, isRequired, label, name, onChange, date, value}: IDropdownCalendarProps) => {
  const {text} = useTheme();
  return (
    <Dropdown
      label={label}
      error={getErrorByObj(errors, name)}
      isRequired={isRequired}
      value={value}
      animated={false}
      rightComponent={() => <Icon name="CalendarIcon" fill={text} size={sizes[20]} />}
      dropdownStyle={styles.dropdownStyle}>
      {(onClose) => (
        <CalendarControls
          selectedDate={date}
          onSelectedDate={(d) => {
            onChange(d);
            onClose();
          }}
          isFollowedNextMonth
        />
      )}
    </Dropdown>
  );
};

const styles = StyleSheet.create({
  dropdownStyle: {
    width: responsiveScreenWidth(100) - sizes[20],
    borderWidth: 0,
    padding: 0,

    shadowColor: 'rgb(118, 105, 103)',
    shadowOffset: {
      width: 0,
      height: sizes[4],
    },
    shadowOpacity: 0.2,
    shadowRadius: sizes[20],
    elevation: 10,
    marginTop: -sizes[100],
    marginLeft: -sizes[10],
  },
});

export default DropdownCalendar;
