import React, {useCallback, useContext, useMemo, useState} from 'react';
//import ModalAgreementAdMob from '../components/Modals/ModalAgreementAdMob';
import ModalInfo from '../components/Modals/ModalInfo';
import ModalLoadingScreen from '../components/Modals/ModalLoadingScreen';
import ModalPreviewImages from '../components/Modals/ModalPreviewImages';
import UrlModalSheetActions from '../components/Modals/ModalSheetActions/UrlModalSheetActions';
import ModalUpdateApp from '../components/Modals/ModalUpdateApp';

interface IModalContext {
  executeModal: (item: IItem) => any;
}

enum TypeModal {
  update,
  info,
  adMob,
  urlSheet,
  previewImages,
  isLoadingScreen,
}

interface IItem {
  type: TypeModal;
  payload?: any;
  priority: 'high' | 'low';
}

const ModalContext = React.createContext({} as IModalContext);

const useModal = () => {
  const context = useContext(ModalContext);
  return context;
};

const ProviderModal = ({children}: any) => {
  const [stack, setStack] = useState<IItem[]>([]);
  const [modal, setModal] = useState<IItem | null>(null);

  const executeModal = useMemo(() => {
    return {
      executeModal: (item: IItem) => {
        setModal((modal) => {
          if (modal === null) {
            return item;
          } else {
            if (item.priority === 'high') {
              setStack((stack) => {
                return [...stack, item];
              });
            }
            return modal;
          }
        });
      },
    };
  }, []);

  const handleClose = useCallback(() => {
    setStack((stack) => {
      if (stack.length > 0) {
        setModal(stack[0]);
        return stack.filter((_, i) => i !== 0);
      } else {
        setModal(null);
        return stack;
      }
    });
  }, []);

  return (
    <ModalContext.Provider value={executeModal}>
      {(modal?.type === TypeModal.info ?? false) && (
        <ModalInfo texts={Array.isArray(modal?.payload) ? modal?.payload! : []} modalVisible onClose={handleClose} />
      )}
      {(modal?.type === TypeModal.update ?? false) && (
        <ModalUpdateApp isRequired={modal?.payload ?? false} modalVisible onClose={handleClose} />
      )}
      {(modal?.type === TypeModal.urlSheet ?? false) && (
        <UrlModalSheetActions url={modal?.payload} modalVisible onClose={handleClose} />
      )}
      {(modal?.type === TypeModal.isLoadingScreen ?? false) && <ModalLoadingScreen />}

      {(modal?.type === TypeModal.previewImages ?? false) && (
        <ModalPreviewImages
          images={modal?.payload?.images ?? []}
          initIndex={modal?.payload?.index ?? 0}
          modalVisible
          onClose={handleClose}
        />
      )}

      {/*   <ModalAgreementAdMob modalVisible={modal?.type === TypeModal.adMob ?? false} onClose={handleClose} /> */}
      {children}
    </ModalContext.Provider>
  );
};

export {useModal, TypeModal};
export default ProviderModal;
