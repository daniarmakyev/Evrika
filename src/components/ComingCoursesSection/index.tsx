'use client';

import Link from "next/link";
import classNames from "classnames";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import SectionInfo from "@components/SectionInfo";
import Calendar from "@icons/calendar.svg";
import Hours from "@icons/hours.svg";
import Place from "@icons/place.svg";
import styles from "./styles.module.scss";

dayjs.locale("ru");

const coursesCards = [
  {
    title: "Английский язык",
    description: "Интерактивные курсы английского языка для всех уровней — от начинающих до продвинутых Подходит для учёбы, работы и путешествий.",
    detail: {
      start_course: "2025-06-24T10:00:00.000Z",
      duration: "2025-12-24T10:00:00.000Z",
      places: 7,
      btn: {
        link: "",
        name: "Записаться",
      },
    },
    more: "Подробнее о курсе",
    link: "/courses/english-b2"
  },
  {
    title: "Французский язык",
    description: "Интерактивные курсы французского языка для всех уровней — от новичков до продвинутых. Осваивайте язык легко, в удобном темпе, с опытными преподавателями и современной программой. Идеально для учёбы, работы и путешествий.",
    more: "Узнать больше о курсе",
    link: "/courses/french-b2"
  },
];

const ComingCoursesSection = ({}) => {
  const scrollToSignup = () => {
    setTimeout(() => {
      const section = document.getElementById("signup");
      if (section) {
        const offset = section.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: offset, behavior: "smooth" });
      }
    }, 0);
  };

  return (
    <section className={classNames(styles.comingCourses, "container")}>
      <div className={styles.comingCourses__container}>
        <SectionInfo
          title="Ближайшие курсы"
          description="Если вы еще новичок, советуем поступать на ближайший курс, чтобы не терять время"
          all_see="Смотреть все курсы"
          link="/"
        />
        <div className={styles.comingCourses__cards}>
          {coursesCards.map((card, index) => {
            const current = card;
            const next = coursesCards[index + 1];
            const prev = coursesCards[index - 1];
          
            let className = styles.comingCourses__wrapper;
          
            if (current.detail && next && !next.detail) {
              className = styles.comingCourses__wrapper_big;
            }
          
            if (!current.detail && prev && prev.detail) {
              className = styles.comingCourses__wrapper_small;
            }
            
            return (
              <div key={index} className={classNames(styles.comingCourses__wrapper, className)}>
                <div className={styles.comingCourses__title}>
                  <h3>{card.title}</h3>
                </div>
                <div className={classNames(styles.comingCourses__description, {
                  [styles.comingCourses__description_isDetails]: card.detail,
                })}>
                  <p>{card.description}</p>
                </div>
                {card.detail && (
                  <div className={styles.comingCourses__details}>
                    <div className={styles.comingCourses__infoBlock}>
                      <div className={styles.comingCourses__detail}>
                        <Calendar />
                        <div className={styles.comingCourses__info}>
                          <span>Запуск курса</span>
                          <p>{dayjs(card.detail.start_course).format("DD MMMM YYYY")}</p>
                        </div>
                      </div>
                      <div className={styles.comingCourses__detail}>
                        <Hours />
                        <div className={styles.comingCourses__info}>
                          <span>Длительность</span>
                          <p>{dayjs(card.detail.duration).diff(card.detail.start_course, "month")} месяцев</p>
                        </div>
                      </div>
                      <div className={styles.comingCourses__detail}>
                        <Place />
                        <div className={styles.comingCourses__info}>
                          <span>Свободных мест</span>
                          <p>{card.detail.places} мест</p>
                        </div>
                      </div>
                    </div>
                    <div className={styles.comingCourses__active}>
                      <button onClick={scrollToSignup}>
                        <span>{card.detail.btn.name}</span>
                      </button>
                      <Link href={card.link} className={styles.comingCourses__more}>
                        <span>{card.more}</span>
                      </Link>
                    </div>
                  </div>
                )}
                {!card.detail && card.more && (
                  <Link href={card.link} className={styles.comingCourses__more}>
                    <span>{card.more}</span>
                  </Link>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
};

export default ComingCoursesSection;