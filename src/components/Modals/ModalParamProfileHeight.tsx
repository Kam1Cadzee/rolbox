import React, {useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import ScrollPicker from '../controls/ScrollPicker/CustomScrollPicker';
import {sizes} from '../../context/ThemeContext';
import ModalParamProfile from './ModalParamProfile';
import IUnit from '../../typings/IUnit';
import IOption from '../../typings/IOption';
import TypeHeight, {
  convertCmIntoFoot,
  convertCmIntoInch,
  convertFootIntoCm,
  DEFAULT_HEIGHT_OPTION,
  MIN_HEIGHT_OPTION,
  useOptionsHeight,
  useOptionsHeightCM,
  useOptionsHeightFOOT,
  useOptionsHeightINCH,
} from '../../typings/TypeHeight';
import RadioButton from '../controls/RadioButton';
import t from '../../utils/t';

interface ModalParamProfileHeightProps {
  onClose: any;
  modalVisible: boolean;
  onSubmit: (d: IUnit<TypeHeight>) => void;
  defaultValue?: IUnit<TypeHeight>;
  clearValue: any;
}

const ModalParamProfileHeight = ({
  modalVisible,
  clearValue,
  onClose,
  onSubmit,
  defaultValue,
}: ModalParamProfileHeightProps) => {
  const optionsHeight = useOptionsHeight();
  const optionsCM = useOptionsHeightCM();
  const optionsFOOT = useOptionsHeightFOOT();
  const optionsINCH = useOptionsHeightINCH();

  const [value, setValue] = useState(defaultValue ? defaultValue.value : DEFAULT_HEIGHT_OPTION);
  const [unit, setUnit] = useState(defaultValue ? defaultValue.unit : TypeHeight.cm);
  const [valueFoot, setValueFoot] = useState(convertCmIntoFoot(value));
  const [valueInch, setValueInch] = useState(convertCmIntoInch(value));

  const indexes = useMemo(() => {
    const res = {
      value: optionsCM.findIndex((o) => o.value === value),
      valueFoot: optionsFOOT.findIndex((o) => o.value === valueFoot),
      valueInch: optionsINCH.findIndex((o) => o.value === valueInch),
    };

    return res;
  }, [unit, defaultValue]);

  const handleSubmit = () => {
    onSubmit({
      unit,
      value: unit === TypeHeight.cm ? value : convertFootIntoCm(valueFoot, valueInch),
    });
    onClose();
  };

  const handleClear = () => {
    onSubmit(clearValue);
    onClose();
  };

  const handleSelectHeightCM = (option: IOption<string, number>) => {
    setValue(option.value);
  };

  const handleSelectHeightFOOT = (option: IOption<string, number>) => {
    setValueFoot(option.value);
  };

  const handleSelectHeightINCH = (option: IOption<string, number>) => {
    setValueInch(option.value);
  };

  const changeUnit = (unit: TypeHeight) => {
    if (unit === TypeHeight.foot) {
      const foot = convertCmIntoFoot(value);
      const inch = convertCmIntoInch(value);

      if (inch === 12) {
        setValueFoot(foot + 1);
        setValueInch(0);
      } else {
        setValueFoot(foot);
        setValueInch(inch);
      }
    } else if (unit === TypeHeight.cm) {
      setValue(convertFootIntoCm(valueFoot, valueInch));
    }
    setUnit(unit);
  };

  return (
    <ModalParamProfile
      style={styles.modal}
      title={t('height')}
      onClose={onClose}
      onClear={handleClear}
      modalVisible={modalVisible}
      onApply={handleSubmit}>
      <View style={styles.con}>
        <View
          style={[
            styles.view,
            {
              paddingHorizontal: sizes[14],
            },
          ]}>
          {optionsHeight.map((o) => {
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
            },
          ]}>
          {unit === TypeHeight.cm ? (
            <ScrollPicker<string>
              key={1}
              style={{
                flexGrow: 1,
              }}
              options={optionsCM}
              defaultSelectedIndex={indexes.value}
              onValueChange={handleSelectHeightCM}
            />
          ) : (
            <>
              <ScrollPicker<string>
                key={2}
                style={styles.item}
                options={optionsFOOT}
                defaultSelectedIndex={indexes.valueFoot}
                onValueChange={handleSelectHeightFOOT}
              />
              <ScrollPicker<string>
                key={3}
                style={styles.item}
                options={optionsINCH}
                defaultSelectedIndex={indexes.valueInch}
                onValueChange={handleSelectHeightINCH}
              />
            </>
          )}
        </View>
      </View>
    </ModalParamProfile>
  );
};

const styles = StyleSheet.create({
  item: {
    width: sizes[70],
  },
  con: {
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    flexDirection: 'row',
    maxWidth: '70%',
  },
  modal: {
    paddingHorizontal: sizes[36],
    marginHorizontal: -sizes[16],
  },
  view: {
    flexDirection: 'row',
    flexGrow: 1,
    justifyContent: 'space-between',
  },
});

export default ModalParamProfileHeight;
