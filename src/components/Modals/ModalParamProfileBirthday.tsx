import React, {useMemo, useState} from 'react';
import {StyleSheet} from 'react-native';
import {
  checkDate,
  getDaysRange,
  getDefaultDate,
  getLastDay,
  MIN_YEAR,
  monthShortNames,
  years,
} from '../../utils/utilsOfDate';
import IOption from '../../typings/IOption';
import ScrollPicker from '../controls/ScrollPicker/CustomScrollPicker';
import {sizes} from '../../context/ThemeContext';
import ModalParamProfile from './ModalParamProfile';
import t from '../../utils/t';

interface ModalParamProfileBirthdayProps {
  onClose: any;
  modalVisible: boolean;
  onSubmit: (d: Date) => void;
  defaultValue?: Date;
  clearValue: any;
  isClear?: boolean;
}

const ModalParamProfileBirthday = ({
  modalVisible,
  clearValue,
  onClose,
  onSubmit,
  defaultValue,
  isClear,
}: ModalParamProfileBirthdayProps) => {
  const [date, setDate] = useState(defaultValue || getDefaultDate());
  const days = useMemo(() => {
    return getDaysRange(date);
  }, [date]);

  const indexes = useMemo(() => {
    const month = date.getMonth();
    const day = date.getDate() - 1;
    const year = date.getFullYear() - MIN_YEAR;

    return {month, day, year};
  }, [date]);

  const handleSubmit = () => {
    onSubmit(date);
    onClose();
  };

  const handleClear = () => {
    onSubmit(clearValue);
    onClose();
  };

  const handleSelectMonth = (option: IOption<string, number>, i: number) => {
    const o = option;
    if (o) {
      setDate((d) => {
        const newDate = new Date(d);
        const day = d.getDate();
        newDate.setMonth(o.value, 1);

        return checkDate(newDate, day);
      });
    }
  };

  const handleSelectYear = (option: IOption<number>, i: number) => {
    const o = option;
    if (o) {
      setDate((d) => {
        const newDate = new Date(d);
        const day = d.getDate();
        const month = d.getMonth();
        newDate.setFullYear(+o.label, month, 1);

        return checkDate(newDate, day);
      });
    }
  };

  const handleSelectDate = (option: IOption<number>, i: number) => {
    const o = option;
    if (o) {
      setDate((d) => {
        const newDate = new Date(d);
        newDate.setDate(+o.label);

        return newDate;
      });
    }
  };

  return (
    <ModalParamProfile
      style={styles.modal}
      title={t('birthday')}
      onClose={onClose}
      modalVisible={modalVisible}
      onApply={handleSubmit}
      onClear={isClear && handleClear}>
      <ScrollPicker<number>
        style={styles.item}
        options={monthShortNames(indexes.year)}
        defaultSelectedIndex={indexes.month}
        onValueChange={handleSelectMonth}
      />
      <ScrollPicker<number>
        style={styles.item}
        options={days}
        defaultSelectedIndex={indexes.day}
        onValueChange={handleSelectDate}
      />
      <ScrollPicker<number>
        style={styles.item}
        options={years}
        defaultSelectedIndex={indexes.year}
        onValueChange={handleSelectYear}
      />
    </ModalParamProfile>
  );
};

const styles = StyleSheet.create({
  item: {
    width: sizes[50],
    marginHorizontal: sizes[10],
  },
  modal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: sizes[36],
    marginHorizontal: -sizes[10],
  },
});

export default ModalParamProfileBirthday;
