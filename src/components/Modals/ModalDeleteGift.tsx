import React from 'react';
import giftService from '../../services/giftService/giftService';
import useAxios from '../../useHooks/useAxios';
import t from '../../utils/t';
import ModalConfirm from './ModalConfirm';

interface IModalDeleteGiftProps {
  modalVisible: boolean;
  onClose: any;
  idGift: string;
  onDelete: any;
}

const ModalDeleteGift = ({modalVisible, onClose, idGift, onDelete}: IModalDeleteGiftProps) => {
  const {isLoading, request} = useAxios(giftService.deleteGift);

  const onConfirm = async () => {
    const res = await request(idGift);

    if (res.success) {
      onDelete();
      onClose();
    }
  };

  return (
    <ModalConfirm
      isLoading={isLoading}
      modalVisible={modalVisible}
      onClose={onClose}
      onConfirm={onConfirm}
      confirmText={t('delete')}
      title={t('deleteGift')}
      subTitle={t('textToDeleteGift')}
    />
  );
};

export default ModalDeleteGift;
