import { atom } from 'jotai';

export type ModalKey = 'SIGN_UP' | 'SIGN_IN';

// 初期値として undefined を指定
export const modalState = atom<ModalKey | undefined>(undefined);
