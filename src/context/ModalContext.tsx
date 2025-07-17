/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ModalState<T = any> {
  isOpen: boolean;
  data: T | null;
}

interface ModalsContextType {
  modals: Record<string, ModalState>;
  openModal: <T = any>(key: string, data?: T) => void;
  closeModal: (key: string) => void;
}

const ModalsContext = createContext<ModalsContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modals, setModals] = useState<Record<string, ModalState>>({});

  const openModal = <T = any,>(key: string, data?: T) => {
    setModals((prev) => ({
      ...prev,
      [key]: { isOpen: true, data: data ?? null },
    }));
  };

  const closeModal = (key: string) => {
    setModals((prev) => ({
      ...prev,
      [key]: { isOpen: false, data: null },
    }));
  };

  return (
    <ModalsContext.Provider value={{ modals, openModal, closeModal }}>
      {children}
    </ModalsContext.Provider>
  );
};

export function useModal<T = any>(key: string) {
  const context = useContext(ModalsContext);
  if (!context) throw new Error('useModal должен использоваться внутри ModalProvider');
  const { modals, openModal, closeModal } = context;
  const state = modals[key] || { isOpen: false, data: null };
  return {
    isOpen: state.isOpen,
    data: state.data as T | null,
    openModal: (data?: T) => openModal<T>(key, data),
    closeModal: () => closeModal(key),
  };
}