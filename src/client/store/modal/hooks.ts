import { useAtom } from 'jotai';

import type { ModalKey } from './state';
import { modalState } from './state';

// useIsOpenModal フック
export const useIsOpenModal = (key: ModalKey): boolean => {
  const [modalKey] = useAtom(modalState); // useRecoilValueの代わりにuseAtom
  return modalKey === key;
};

// useOpenModal フック
export const useOpenModal = () => {
  const [, setModal] = useAtom(modalState); // useSetRecoilStateの代わりにuseAtom
  return (key: ModalKey) => {
    setModal(key); // モーダルを開く
  };
};

// useCloseModal フック
export const useCloseModal = () => {
  const [, setModal] = useAtom(modalState); // useSetRecoilStateの代わりにuseAtom
  return () => {
    setModal(undefined); // モーダルを閉じる
  };
};
