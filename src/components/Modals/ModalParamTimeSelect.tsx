import React, {useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import ScrollPicker from '../controls/ScrollPicker/CustomScrollPicker';
import {sizes} from '../../context/ThemeContext';
import ModalParamProfile from './ModalParamProfile';
import IUnit from '../../typings/IUnit';
import IOption from '../../typings/IOption';
import RadioButton from '../controls/RadioButton';
import t from '../../utils/t';
import TypeTime, {ExtensionTime, TimeOfDay} from '../../typings/TypeTime';
import {useFormattingContext} from '../../context/FormattingContext';

interface ModalParamTimeSelectProps {
  onClose: any;
  modalVisible: boolean;
  onSubmit: (d: IUnit<TypeTime, string>) => void;
  defaultValue?: IUnit<TypeTime, string>;
  clearValue: any;
}

const ModalParamTimeSelect = ({
  modalVisible,
  onClose,
  onSubmit,
  defaultValue,
  clearValue,
}: ModalParamTimeSelectProps) => {
  const {payload} = useFormattingContext();
  const value = useMemo(() => {
    const time = defaultValue ? defaultValue.value : ExtensionTime.getDefaultTime(payload.typeTime);
    return ExtensionTime.parseTime(time);
  }, []);
  const [unit, setUnit] = useState(defaultValue ? defaultValue.unit : payload.typeTime);
  const [hour, setHour] = useState(value.hour);
  const [minute, setMinute] = useState(value.minute);
  const [timeOfDay, setTimeOfDay] = useState(value.timeOfDay);

  const optionsTypeTimes = ExtensionTime.useOptionsTime();
  const optionsHours = useMemo(() => ExtensionTime.getOptionsHours(unit), [unit]);
  const optionsMinutes = useMemo(() => ExtensionTime.getOptionsMinutes(), []);
  const optionsTimeOfDay = useMemo(() => ExtensionTime.getOptionsTimeOfDay(), []);

  const indexes = useMemo(() => {
    return {
      hour: optionsHours.findIndex((o) => o.value === hour),
      minute: optionsMinutes.findIndex((o) => o.value === minute),
      timeOfDay: optionsTimeOfDay.findIndex((o) => o.value === timeOfDay),
    };
  }, [unit, defaultValue]);

  const handleSubmit = () => {
    onSubmit({
      unit,
      value: ExtensionTime.stringifyTime(hour, minute, unit, timeOfDay),
    });
    onClose();
  };

  const handleSelectHour = (option: IOption<string, number>) => {
    setHour(option.value);
  };

  const handleSelectMinute = (option: IOption<string, number>) => {
    setMinute(option.value);
  };

  const handleSelectTimeOfDay = (option: IOption<string, TimeOfDay>) => {
    setTimeOfDay(option.value);
  };

  const changeUnit = (unit: TypeTime) => {
    if (unit === TypeTime.clock12) {
      setTimeOfDay(hour > 11 ? TimeOfDay.PM : TimeOfDay.AM);
      setHour((hour) => {
        return hour % 12;
      });
    } else {
      setHour((hour) => {
        return timeOfDay === TimeOfDay.PM ? hour + 12 : hour;
      });
    }
    setUnit(unit);
  };

  const handleClear = () => {
    onSubmit(clearValue);
    onClose();
  };

  return (
    <ModalParamProfile
      onClear={handleClear}
      style={styles.modal}
      title={t('titleTime')}
      onClose={onClose}
      modalVisible={modalVisible}
      onApply={handleSubmit}>
      <View
        style={{
          flexWrap: 'wrap',
          flexDirection: 'row',
        }}>
        <View style={[styles.view, {}]}>
          {optionsTypeTimes.map((o) => {
            return (
              <RadioButton
                key={o.value}
                label={o.label}
                onPress={() => changeUnit(o.value)}
                selected={unit === o.value}
              />
            );
          })}
        </View>
        <View
          style={[
            styles.view,
            {
              marginVertical: sizes[10],
              justifyContent: 'center',
            },
          ]}>
          <ScrollPicker<string>
            key={1 + unit}
            style={styles.item}
            options={optionsHours}
            defaultSelectedIndex={indexes.hour}
            onValueChange={handleSelectHour}
          />
          <ScrollPicker<string>
            key={2}
            style={styles.item}
            options={optionsMinutes}
            defaultSelectedIndex={indexes.minute}
            onValueChange={handleSelectMinute}
          />
          {unit === TypeTime.clock12 && (
            <ScrollPicker<string>
              key={3}
              style={styles.item}
              options={optionsTimeOfDay}
              defaultSelectedIndex={indexes.timeOfDay}
              onValueChange={handleSelectTimeOfDay}
            />
          )}
        </View>
      </View>
    </ModalParamProfile>
  );
};

const styles = StyleSheet.create({
  item: {
    width: sizes[50],
    marginHorizontal: sizes[10],
  },
  modal: {
    paddingHorizontal: sizes[20],
  },
  view: {
    flexDirection: 'row',
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  con: {},
});

export default ModalParamTimeSelect;
