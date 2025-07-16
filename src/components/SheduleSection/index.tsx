"use client";

import React from "react";
import { useModal } from "@context/ModalContext";
import classNames from "classnames";
import styles from "./styles.module.scss";
import DaysWeekSelector, { DayOfWeek } from "@components/DaysWeekSelector";

type Lesson = {
  time: string;
  subject: string;
  lvl: string;
  teacher: string;
  description: string;
  sub_description: string;
};

const scheduleData: Record<DayOfWeek, Lesson[]> = {
  MON: [
    {
      time: "10:00 - 11:00",
      subject: "Английский язык",
      lvl: "B1",
      teacher: "Асанов А.А.",
      description:
        "Если вы никогда не учили английский или забыли всё со школы — этот курс поможет начать с самого простого. Пошаговое обучение, понятные объяснения и поддержка преподавателей.",
      sub_description:
        "Знание английского делает путешествия проще: вы легко ориентируетесь в аэропортах, отелях, на улицах и сможете свободно общаться с людьми по всему миру, не полагаясь на переводчиков и жесты.",
    },
    {
      time: "11:00 - 12:00",
      subject: "Французский язык",
      lvl: "B1",
      teacher: "Иванова Е.П.",
      description:
        "Если вы никогда не учили английский или забыли всё со школы — этот курс поможет начать с самого простого. Пошаговое обучение, понятные объяснения и поддержка преподавателей.",
      sub_description:
        "Знание английского делает путешествия проще: вы легко ориентируетесь в аэропортах, отелях, на улицах и сможете свободно общаться с людьми по всему миру, не полагаясь на переводчиков и жесты.",
    },
  ],
  TUE: [
    {
      time: "10:00 - 11:00",
      subject: "Кыргызский язык",
      lvl: "A1",
      teacher: "Султанова Л.Т.",
      description:
        "Если вы никогда не учили английский или забыли всё со школы — этот курс поможет начать с самого простого. Пошаговое обучение, понятные объяснения и поддержка преподавателей.",
      sub_description:
        "Знание английского делает путешествия проще: вы легко ориентируетесь в аэропортах, отелях, на улицах и сможете свободно общаться с людьми по всему миру, не полагаясь на переводчиков и жесты.",
    },
  ],
  WED: [
    {
      time: "14:00 - 15:00",
      subject: "Немецкий язык",
      lvl: "A1",
      teacher: "Султанова Л.Т.",
      description:
        "Если вы никогда не учили английский или забыли всё со школы — этот курс поможет начать с самого простого. Пошаговое обучение, понятные объяснения и поддержка преподавателей.",
      sub_description:
        "Знание английского делает путешествия проще: вы легко ориентируетесь в аэропортах, отелях, на улицах и сможете свободно общаться с людьми по всему миру, не полагаясь на переводчиков и жесты.",
    },
  ],
  THU: [
    {
      time: "12:00 - 13:00",
      subject: "Японский язык",
      lvl: "A1",
      teacher: "Султанова Л.Т.",
      description:
        "Если вы никогда не учили английский или забыли всё со школы — этот курс поможет начать с самого простого. Пошаговое обучение, понятные объяснения и поддержка преподавателей.",
      sub_description:
        "Знание английского делает путешествия проще: вы легко ориентируетесь в аэропортах, отелях, на улицах и сможете свободно общаться с людьми по всему миру, не полагаясь на переводчиков и жесты.",
    },
  ],
  FRI: [
    {
      time: "16:00 - 17:00",
      subject: "Китайский язык",
      lvl: "A1",
      teacher: "Султанова Л.Т.",
      description:
        "Если вы никогда не учили английский или забыли всё со школы — этот курс поможет начать с самого простого. Пошаговое обучение, понятные объяснения и поддержка преподавателей.",
      sub_description:
        "Знание английского делает путешествия проще: вы легко ориентируетесь в аэропортах, отелях, на улицах и сможете свободно общаться с людьми по всему миру, не полагаясь на переводчиков и жесты.",
    },
  ],
  SAT: [],
  SUN: [],
};

const allTimeSlots = [
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
];

const getColorClassBySubject = (subject: string) => {
  if (subject.includes("Английский"))
    return styles.schedule__card_subjectEnglish;
  if (subject.includes("Французский"))
    return styles.schedule__card_subjectFrench;
  if (subject.includes("Кыргызский"))
    return styles.schedule__card_subjectKyrgyz;
  if (subject.includes("Немецкий")) return styles.schedule__card_subjectGerman;
  if (subject.includes("Японский"))
    return styles.schedule__card_subjectJapanese;
  if (subject.includes("Китайский"))
    return styles.schedule__card_subjectChinese;
  return styles.subjectDefault;
};

const ScheduleSection = () => {
  const { openModal } = useModal<Lesson>("global-schedule-lesson");
  const [activeDay, setActiveDay] = React.useState<DayOfWeek>("MON");

  const handleDayChange = (day: DayOfWeek) => {
    setActiveDay(day);
  };

  return (
    <section className={classNames(styles.schedule, "container")}>
      <div className={styles.schedule__container}>
        <div className={styles.schedule__title}>
          <h3>Расписание</h3>
        </div>

        <DaysWeekSelector
          activeDay={activeDay}
          onDayChange={handleDayChange}
          className={styles.schedule__daysWeek}
        />

        {scheduleData[activeDay].length > 0 && <p>Время</p>}

        <div className={styles.schedule__lessons}>
          {allTimeSlots.map((slot, index) => {
            const lessons = scheduleData[activeDay].filter((lesson) =>
              lesson.time.startsWith(slot)
            );

            if (scheduleData[activeDay].length === 0) return null;

            return (
              <div key={index} className={styles.schedule__wrapper}>
                <div className={styles.schedule__time}>
                  <span>{slot}</span>
                </div>
                <div
                  className={classNames(styles.schedule__cards, {
                    [styles.schedule__cards_hide]: lessons.length === 0,
                  })}
                >
                  {lessons.length > 0
                    ? lessons.map((lesson, index) => (
                        <div
                          key={index}
                          onClick={() => openModal(lesson)}
                          className={classNames(
                            styles.schedule__card,
                            getColorClassBySubject(lesson.subject)
                          )}
                        >
                          <div className={styles.schedule__timeRange}>
                            <span>{lesson.time}</span>
                          </div>
                          <div className={styles.schedule__teacher}>
                            <span>{lesson.teacher}</span>
                          </div>
                          <div className={styles.schedule__subject}>
                            <span>{lesson.subject + " " + lesson.lvl}</span>
                          </div>
                        </div>
                      ))
                    : null}
                </div>
              </div>
            );
          })}
          {scheduleData[activeDay].length === 0 && (
            <div className={styles.schedule__empty}>
              <span>Нет уроков</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ScheduleSection;
