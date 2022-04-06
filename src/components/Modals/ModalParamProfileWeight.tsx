import React, {useMemo, useState} from 'react';
import {StyleSheet} from 'react-native';
import ScrollPicker from '../controls/ScrollPicker/CustomScrollPicker';
import {sizes} from '../../context/ThemeContext';
import ModalParamProfile from './ModalParamProfile';
import IUnit from '../../typings/IUnit';
import TypeWeight, {
  DEFAULT_WEIGHT_OPTION,
  maxValueWeight,
  MIN_WEIGHT_OPTION,
  useOptionsWeight,
} from '../../typings/TypeWeight';
import generateRange from '../../utils/generateRange';
import IOption from '../../typings/IOption';
import t from '../../utils/t';

interface ModalParamProfileWeightProps {
  onClose: any;
  modalVisible: boolean;
  onSubmit: (d: IUnit<TypeWeight>) => void;
  defaultValue?: IUnit<TypeWeight>;
  clearValue: any;
}

const getOptionsValue = (type: TypeWeight) => {
  return generateRange(MIN_WEIGHT_OPTION, maxValueWeight(type)).map((o) => ({
    value: o.value,
    label: o.value,
  }));
};

const ModalParamProfileWeight = ({
  modalVisible,
  clearValue,
  onClose,
  onSubmit,
  defaultValue,
}: ModalParamProfileWeightProps) => {
  const optionsWeight = useOptionsWeight();
  const [value, setValue] = useState(defaultValue ? defaultValue.value : DEFAULT_WEIGHT_OPTION);
  const [unit, setUnit] = useState(defaultValue ? defaultValue.unit : TypeWeight.kg);
  const options = useMemo(() => {
    const res = getOptionsValue(unit);

    return res;
  }, [unit]);

  const indexes = useMemo(() => {
    return {
      weight: options.findIndex((o) => +o.value === value),
      unit: optionsWeight.findIndex((o) => o.value === unit),
    };
  }, [defaultValue, unit]);

  const handleSubmit = () => {
    onSubmit({
      unit,
      value,
    });
    onClose();
  };

  const handleClear = () => {
    onSubmit(clearValue);
    onClose();
  };

  const handleSelectWeight = (option: IOption<string>) => {
    setValue(+option.value);
  };
  const handleSelectUnit = (option: IOption<string, TypeWeight>) => {
    setValue((value) => {
      const newValue = Math.min(value, maxValueWeight(option.value));
      return newValue;
    });
    setUnit(option.value as TypeWeight);
  };

  return (
    <ModalParamProfile
      style={styles.modal}
      title={t('weight')}
      onClose={onClose}
      modalVisible={modalVisible}
      onClear={handleClear}
      onApply={handleSubmit}>
      <ScrollPicker<string>
        style={styles.item}
        options={options}
        defaultSelectedIndex={indexes.weight}
        onValueChange={handleSelectWeight}
      />
      <ScrollPicker<string>
        style={styles.item}
        options={optionsWeight}
        defaultSelectedIndex={indexes.unit}
        onValueChange={handleSelectUnit}
      />
    </ModalParamProfile>
  );
};

const styles = StyleSheet.create({
  item: {
    width: sizes[70],
    marginHorizontal: sizes[10],
  },
  modal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: sizes[36],
    marginHorizontal: -sizes[10],
  },
});

export default ModalParamProfileWeight;
