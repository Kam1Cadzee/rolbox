import React from 'react';
import ModalConfirm from './ModalConfirm';
import wishListService from '../../services/wishListService/wishListService';
import useAxios from '../../useHooks/useAxios';
import t from '../../utils/t';

interface IModalDeleteWishlistProps {
  modalVisible: boolean;
  onClose: any;
  idWishlist: string;
  onDelete: any;
}

const ModalDeleteWishlist = ({modalVisible, onClose, idWishlist, onDelete}: IModalDeleteWishlistProps) => {
  const {isLoading, request} = useAxios(wishListService.deleteWishList);

  const onConfirm = async () => {
    const res = await request(idWishlist);
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
      title={t('deleteList')}
      subTitle={t('textToDeleteList')}
    />
  );
};

export default ModalDeleteWishlist;
