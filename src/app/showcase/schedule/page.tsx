"use client";
import React, { useState } from "react";
import styles from "./styles.module.scss";
import DaysWeekSelector, { DayOfWeek } from "@components/DaysWeekSelector";
import classNames from "classnames";

interface ScheduleItem {
  group: string;
  time: string;
  teacher: string;
  lesson: string;
  link: string;
}

const scheduleData: Record<DayOfWeek, ScheduleItem[]> = {
  Пн: [
    {
      group: "Испанский-0924-01-B1",
      time: "10:00 - 11:00",
      teacher: "Нина Иванова",
      lesson: "Изучить глаголы",
      link: "https://docs.google.com...",
    },
    {
      group: "Математика-0924-02-A2",
      time: "11:30 - 12:30",
      teacher: "Петр Смирнов",
      lesson: "Алгебра, уравнения",
      link: "https://zoom.us/j/123...",
    },
    {
      group: "Английский-0924-03-C1",
      time: "14:00 - 15:00",
      teacher: "Анна Козлова",
      lesson: "Грамматика времен",
      link: "https://meet.google.com...",
    },
    {
      group: "Физика-0924-04-B2",
      time: "15:30 - 16:30",
      teacher: "Иван Петров",
      lesson: "Механика",
      link: "https://teams.microsoft.com...",
    },
    {
      group: "История-0924-05-A1",
      time: "17:00 - 18:00",
      teacher: "Мария Сидорова",
      lesson: "Средние века",
      link: "https://classroom.google.com...",
    },
    {
      group: "Химия-0924-06-B1",
      time: "18:30 - 19:30",
      teacher: "Елена Волкова",
      lesson: "Органическая химия",
      link: "https://discord.gg/abc123...",
    },
    {
      group: "Литература-0924-07-A2",
      time: "20:00 - 21:00",
      teacher: "Ольга Морозова",
      lesson: "Русская поэзия",
      link: "https://skype.com/join/...",
    },
  ],
  Вт: [
    {
      group: "Биология-0924-08-C1",
      time: "09:00 - 10:00",
      teacher: "Дмитрий Лебедев",
      lesson: "Клеточное строение",
      link: "https://zoom.us/j/456...",
    },
    {
      group: "География-0924-09-B2",
      time: "10:30 - 11:30",
      teacher: "Татьяна Соколова",
      lesson: "Климатические зоны",
      link: "https://meet.google.com...",
    },
    {
      group: "Информатика-0924-10-A1",
      time: "12:00 - 13:00",
      teacher: "Алексей Новиков",
      lesson: "Программирование",
      link: "https://teams.microsoft.com...",
    },
    {
      group: "Французский-0924-11-B1",
      time: "14:00 - 15:00",
      teacher: "Жанна Дюбуа",
      lesson: "Разговорная практика",
      link: "https://discord.gg/def456...",
    },
    {
      group: "Обществознание-0924-12-A2",
      time: "15:30 - 16:30",
      teacher: "Сергей Орлов",
      lesson: "Политическая система",
      link: "https://classroom.google.com...",
    },
    {
      group: "Экономика-0924-13-C1",
      time: "17:00 - 18:00",
      teacher: "Валентина Попова",
      lesson: "Макроэкономика",
      link: "https://zoom.us/j/789...",
    },
    {
      group: "Психология-0924-14-B2",
      time: "18:30 - 19:30",
      teacher: "Андрей Федоров",
      lesson: "Когнитивные процессы",
      link: "https://skype.com/join/...",
    },
  ],
  Ср: [
    {
      group: "Философия-0924-15-A1",
      time: "09:30 - 10:30",
      teacher: "Николай Жуков",
      lesson: "Античная философия",
      link: "https://meet.google.com...",
    },
    {
      group: "Искусство-0924-16-B1",
      time: "11:00 - 12:00",
      teacher: "Екатерина Белова",
      lesson: "Эпоха Возрождения",
      link: "https://teams.microsoft.com...",
    },
    {
      group: "Музыка-0924-17-A2",
      time: "13:00 - 14:00",
      teacher: "Михаил Романов",
      lesson: "Классическая музыка",
      link: "https://discord.gg/ghi789...",
    },
    {
      group: "Физкультура-0924-18-C1",
      time: "14:30 - 15:30",
      teacher: "Игорь Медведев",
      lesson: "Общая физподготовка",
      link: "https://zoom.us/j/012...",
    },
    {
      group: "Право-0924-19-B2",
      time: "16:00 - 17:00",
      teacher: "Светлана Крылова",
      lesson: "Конституционное право",
      link: "https://classroom.google.com...",
    },
    {
      group: "Немецкий-0924-20-A1",
      time: "17:30 - 18:30",
      teacher: "Вольфганг Мюллер",
      lesson: "Грамматика немецкого",
      link: "https://skype.com/join/...",
    },
    {
      group: "Логика-0924-21-B1",
      time: "19:00 - 20:00",
      teacher: "Лариса Тихонова",
      lesson: "Формальная логика",
      link: "https://meet.google.com...",
    },
  ],
  Чт: [
    {
      group: "Астрономия-0924-22-A2",
      time: "08:00 - 09:00",
      teacher: "Юрий Гагарин",
      lesson: "Солнечная система",
      link: "https://teams.microsoft.com...",
    },
    {
      group: "Экология-0924-23-C1",
      time: "09:30 - 10:30",
      teacher: "Галина Лесная",
      lesson: "Охрана природы",
      link: "https://zoom.us/j/345...",
    },
    {
      group: "Кулинария-0924-24-B2",
      time: "11:00 - 12:00",
      teacher: "Анжела Поварова",
      lesson: "Основы кулинарии",
      link: "https://discord.gg/jkl012...",
    },
  ],
  Пт: [
    {
      group: "Журналистика-0924-29-B2",
      time: "10:00 - 11:00",
      teacher: "Евгений Репортер",
      lesson: "Основы журналистики",
      link: "https://zoom.us/j/678...",
    },
    {
      group: "Театр-0924-30-A1",
      time: "11:30 - 12:30",
      teacher: "Инна Актрисова",
      lesson: "Сценическое мастерство",
      link: "https://discord.gg/mno345...",
    },
  ],
  Сб: [],
  Вс: [],
};

export default function ProfileSchedule() {
  const [activeDay, setActiveDay] = useState<DayOfWeek>("Пн");

  const handleDayChange = (day: DayOfWeek) => {
    setActiveDay(day);
  };

  return (
    <div className={styles.schedule}>
      <div className={classNames(styles.schedule__container, "container")}>
        <div className={styles.schedule__content}>
          <div className={styles.schedule__title}>
            <h3>Расписание занятий</h3>
          </div>

          <DaysWeekSelector
            activeDay={activeDay}
            onDayChange={handleDayChange}
          />

          <div className={styles.schedule__table}>
            {scheduleData[activeDay] && scheduleData[activeDay].length > 0 ? (
              <>
                <div
                  className={`${styles.schedule__row} ${styles.schedule__header}`}
                >
                  <div className={styles.schedule__cell}>Группа</div>
                  <div className={styles.schedule__cell}>Время</div>
                  <div className={styles.schedule__cell}>Преподаватель</div>
                  <div
                    className={styles.schedule__cell}
                    style={{ textDecoration: "none" }}
                  >
                    Урок
                  </div>
                  <div
                    className={styles.schedule__cell}
                    style={{ textDecoration: "none" }}
                  >
                    Ссылка
                  </div>
                </div>

                {scheduleData[activeDay].map((day) => (
                  <div key={day.time} className={styles.schedule__row}>
                    <div className={styles.schedule__cell}>
                      <span className={styles.schedule__group}>
                        {day.group}
                      </span>
                    </div>
                    <div className={styles.schedule__cell}>
                      <span className={styles.schedule__time}>{day.time}</span>
                    </div>
                    <div className={styles.schedule__cell}>
                      <span className={styles.schedule__teacher}>
                        {day.teacher}
                      </span>
                    </div>
                    <div className={styles.schedule__cell}>
                      <a
                        href={day.lesson}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.schedule__link}
                      >
                        {day.lesson}
                      </a>
                    </div>
                    <div className={styles.schedule__cell}>
                      <a
                        href={day.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.schedule__link}
                      >
                        {day.link}
                      </a>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className={styles.schedule__empty}>Уроков нет</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
