'use client';

import React from 'react';

type Lesson = {
  time: string;
  subject: string;
  lvl: string;
  teacher: string;
  description: string;
  sub_description: string;
};

type ModalContextType = {
  lesson: Lesson | null;
  isOpen: boolean;
  openModal: (lesson: Lesson) => void;
  closeModal: () => void;
};

const ModalContext = React.createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = React.useContext(ModalContext);
  if (!context) throw new Error("useModal должен использоваться внутри ModalProvider");
  return context;
};

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [lesson, setLesson] = React.useState<Lesson | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);

  const openModal = (lesson: Lesson) => {
    setLesson(lesson);
    setIsOpen(true);
  };

  const closeModal = () => {
    setLesson(null);
    setIsOpen(false);
  };

  return (
    <ModalContext.Provider value={{ lesson, isOpen, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};