'use client';

import React from 'react';
import { useModal } from '@context/ModalContext';
import classNames from 'classnames';
import Close from "@icons/close.svg";
import styles from './styles.module.scss';

const LessonModal = () => {
  const { lesson, isOpen, closeModal } = useModal();
  const [isVisible, setIsVisible] = React.useState(false);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => closeModal(), 300);
  };

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsVisible(true);
    } else {
      document.body.style.overflow = '';
      const timeout = setTimeout(() => setIsVisible(false), 300);
      return () => {
        document.body.style.overflow = '';
        clearTimeout(timeout);
      }
    }
  }, [isOpen]);

  if (!isOpen || !lesson) return null;

  return (
    <div className={classNames(styles.lessonModal, "container", {
      [styles.lessonModal_show]: isVisible,
    })} onClick={handleClose}>
      <div className={styles.lessonModal__container} onClick={(e) => e.stopPropagation()}>
        <Close onClick={handleClose} />
        <div className={styles.lessonModal__infoLesson}>
          <h3>О предмете: {lesson.subject} {lesson.lvl}</h3>
        </div>
        <div className={styles.lessonModal__description}>
          <span>Начинающим с нуля:</span>
          <p>{lesson.description}</p>
        </div>
        <div className={styles.lessonModal__subDescription}>
          <span>Путешествия без преград:</span>
          <p>{lesson.sub_description}</p>
        </div>
      </div>
    </div>
  );
};

export default LessonModal;