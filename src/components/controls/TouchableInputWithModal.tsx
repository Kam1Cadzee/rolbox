import React, {useState} from 'react';
import TouchableInput from './TouchableInput';
import ModalParamProfileBirthday from '../Modals/ModalParamProfileBirthday';
import ModalParamProfileWeight from '../Modals/ModalParamProfileWeight';
import ModalParamProfileHeight from '../Modals/ModalParamProfileHeight';
import ModalParamTimeSelect from '../Modals/ModalParamTimeSelect';

interface ITouchableInputWithModalProps {
  label: string;
  isRequired?: boolean;
  strValue: string;
  value: any;
  onSubmit: any;
  type: TypeInputModal;
  rightComponent?: any;
  clearValue: any;
  isClear?: boolean;
}

enum TypeInputModal {
  birthday,
  weight,
  height,
  time,
  none,
}
const TouchableInputWithModal = ({
  isRequired,
  label,
  strValue,
  value,
  onSubmit,
  type,
  rightComponent,
  clearValue,
  isClear = false,
}: ITouchableInputWithModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (data: any) => {
    onSubmit(data);
  };
  const handleClose = () => {
    setIsOpen(false);
  };
  const props = {
    onClose: handleClose,
    modalVisible: isOpen,
    onSubmit: handleSubmit,
    defaultValue: value,
    clearValue,
    isClear,
  };
  return (
    <>
      <TouchableInput
        rightComponent={rightComponent}
        label={label}
        onPress={() => setIsOpen(true)}
        strValue={strValue}
        isRequired={isRequired}
      />
      {type === TypeInputModal.birthday && <ModalParamProfileBirthday {...props} />}
      {type === TypeInputModal.weight && <ModalParamProfileWeight {...props} />}
      {type === TypeInputModal.height && <ModalParamProfileHeight {...props} />}
      {type === TypeInputModal.time && <ModalParamTimeSelect {...props} />}
    </>
  );
};

export {TypeInputModal};
export default TouchableInputWithModal;
