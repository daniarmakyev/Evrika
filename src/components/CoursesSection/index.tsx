'use client';

import React from "react";
import classNames from "classnames";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import SectionInfo from "@components/SectionInfo";
import Calendar from "@icons/calendar.svg";
import Hours from "@icons/hours.svg";
import Place from "@icons/place.svg";
import styles from "./styles.module.scss"
import Link from "next/link";
import Pagination from "@components/Pagination";

dayjs.locale("ru");

const cardsCourses = [
  {
    slug: "english-b2",
    title: "Английский язык B2",
    description: "Интерактивные курсы английского языка для всех уровней — от начинающих до продвинутых Подходит для учёбы, работы и путешествий.",
    details: {
      start_course: "2025-06-24T10:00:00.000Z",
      duration: "2025-12-24T10:00:00.000Z",
      places: 7,
    },
    link: "/",
  },
  {
    slug: "english-b1",
    title: "Английский язык B1",
    description: "Интерактивные курсы английского языка для всех уровней — от начинающих до продвинутых Подходит для учёбы, работы и путешествий.",
    details: {
      start_course: "2025-06-24T10:00:00.000Z",
      duration: "2025-12-24T10:00:00.000Z",
      places: 7,
    },
    link: "/",
  },
  {
    slug: "english-a2",
    title: "Английский язык A2",
    description: "Интерактивные курсы английского языка для всех уровней — от начинающих до продвинутых Подходит для учёбы, работы и путешествий.",
    details: {
      start_course: "2025-06-24T10:00:00.000Z",
      duration: "2025-12-24T10:00:00.000Z",
      places: 7,
    },
    link: "/",
  },
  {
    slug: "english-a1",
    title: "Английский язык A1",
    description: "Интерактивные курсы английского языка для всех уровней — от начинающих до продвинутых Подходит для учёбы, работы и путешествий.",
    details: {
      start_course: "2025-06-24T10:00:00.000Z",
      duration: "2025-12-24T10:00:00.000Z",
      places: 7,
    },
    link: "/",
  },
  {
    slug: "franch-b2",
    title: "Французский язык B2",
    description: "Интерактивные курсы английского языка для всех уровней — от начинающих до продвинутых Подходит для учёбы, работы и путешествий.",
    details: {
      start_course: "2025-06-24T10:00:00.000Z",
      duration: "2025-12-24T10:00:00.000Z",
      places: 7,
    },
    link: "/",
  },
  {
    slug: "franch-b1",
    title: "Французский язык B1",
    description: "Интерактивные курсы английского языка для всех уровней — от начинающих до продвинутых Подходит для учёбы, работы и путешествий.",
    details: {
      start_course: "2025-06-24T10:00:00.000Z",
      duration: "2025-12-24T10:00:00.000Z",
      places: 7,
    },
    link: "/",
  },
  {
    slug: "franch-a2",
    title: "Французский язык A2",
    description: "Интерактивные курсы английского языка для всех уровней — от начинающих до продвинутых Подходит для учёбы, работы и путешествий.",
    details: {
      start_course: "2025-06-24T10:00:00.000Z",
      duration: "2025-12-24T10:00:00.000Z",
      places: 7,
    },
    link: "/",
  },
  {
    slug: "franch-a1",
    title: "Французский язык A1",
    description: "Интерактивные курсы английского языка для всех уровней — от начинающих до продвинутых Подходит для учёбы, работы и путешествий.",
    details: {
      start_course: "2025-06-24T10:00:00.000Z",
      duration: "2025-12-24T10:00:00.000Z",
      places: 7,
    },
    link: "/",
  },
  {
    slug: "germany-b2",
    title: "Немецкий язык B2",
    description: "Интерактивные курсы английского языка для всех уровней — от начинающих до продвинутых Подходит для учёбы, работы и путешествий.",
    details: {
      start_course: "2025-06-24T10:00:00.000Z",
      duration: "2025-12-24T10:00:00.000Z",
      places: 7,
    },
    link: "/",
  },
  {
    slug: "germany-b1",
    title: "Немецкий язык B1",
    description: "Интерактивные курсы английского языка для всех уровней — от начинающих до продвинутых Подходит для учёбы, работы и путешествий.",
    details: {
      start_course: "2025-06-24T10:00:00.000Z",
      duration: "2025-12-24T10:00:00.000Z",
      places: 7,
    },
    link: "/",
  },
  {
    slug: "germany-a2",
    title: "Немецкий язык A2",
    description: "Интерактивные курсы английского языка для всех уровней — от начинающих до продвинутых Подходит для учёбы, работы и путешествий.",
    details: {
      start_course: "2025-06-24T10:00:00.000Z",
      duration: "2025-12-24T10:00:00.000Z",
      places: 7,
    },
    link: "/",
  },
  {
    slug: "germany-a1",
    title: "Немецкий язык A1",
    description: "Интерактивные курсы английского языка для всех уровней — от начинающих до продвинутых Подходит для учёбы, работы и путешествий.",
    details: {
      start_course: "2025-06-24T10:00:00.000Z",
      duration: "2025-12-24T10:00:00.000Z",
      places: 7,
    },
    link: "/",
  },
  {
    slug: "china-b2",
    title: "Китайский язык B2",
    description: "Интерактивные курсы английского языка для всех уровней — от начинающих до продвинутых Подходит для учёбы, работы и путешествий.",
    details: {
      start_course: "2025-06-24T10:00:00.000Z",
      duration: "2025-12-24T10:00:00.000Z",
      places: 7,
    },
    link: "/",
  },
  {
    slug: "china-b1",
    title: "Китайский язык B1",
    description: "Интерактивные курсы английского языка для всех уровней — от начинающих до продвинутых Подходит для учёбы, работы и путешествий.",
    details: {
      start_course: "2025-06-24T10:00:00.000Z",
      duration: "2025-12-24T10:00:00.000Z",
      places: 7,
    },
    link: "/",
  },
  {
    slug: "china-a2",
    title: "Китайский язык A2",
    description: "Интерактивные курсы английского языка для всех уровней — от начинающих до продвинутых Подходит для учёбы, работы и путешествий.",
    details: {
      start_course: "2025-06-24T10:00:00.000Z",
      duration: "2025-12-24T10:00:00.000Z",
      places: 7,
    },
    link: "/",
  },
  {
    slug: "china-a1",
    title: "Китайский язык A1",
    description: "Интерактивные курсы английского языка для всех уровней — от начинающих до продвинутых Подходит для учёбы, работы и путешествий.",
    details: {
      start_course: "2025-06-24T10:00:00.000Z",
      duration: "2025-12-24T10:00:00.000Z",
      places: 7,
    },
    link: "/",
  },
  {
    slug: "kyrgyz-b2",
    title: "Кыргызский язык B2",
    description: "Интерактивные курсы английского языка для всех уровней — от начинающих до продвинутых Подходит для учёбы, работы и путешествий.",
    details: {
      start_course: "2025-06-24T10:00:00.000Z",
      duration: "2025-12-24T10:00:00.000Z",
      places: 7,
    },
    link: "/",
  },
  {
    slug: "kyrgyz-b1",
    title: "Кыргызский язык B1",
    description: "Интерактивные курсы английского языка для всех уровней — от начинающих до продвинутых Подходит для учёбы, работы и путешествий.",
    details: {
      start_course: "2025-06-24T10:00:00.000Z",
      duration: "2025-12-24T10:00:00.000Z",
      places: 7,
    },
    link: "/",
  },
  {
    slug: "kyrgyz-a2",
    title: "Кыргызский язык A2",
    description: "Интерактивные курсы английского языка для всех уровней — от начинающих до продвинутых Подходит для учёбы, работы и путешествий.",
    details: {
      start_course: "2025-06-24T10:00:00.000Z",
      duration: "2025-12-24T10:00:00.000Z",
      places: 7,
    },
    link: "/",
  },
  {
    slug: "kyrgyz-a1",
    title: "Кыргызский язык A1",
    description: "Интерактивные курсы английского языка для всех уровней — от начинающих до продвинутых Подходит для учёбы, работы и путешествий.",
    details: {
      start_course: "2025-06-24T10:00:00.000Z",
      duration: "2025-12-24T10:00:00.000Z",
      places: 7,
    },
    link: "/",
  },
  {
    slug: "kyrgyz-a1-advanced",
    title: "Кыргызский язык A1 - продвинутый",
    description: "Интерактивные курсы английского языка для всех уровней — от начинающих до продвинутых Подходит для учёбы, работы и путешествий.",
    details: {
      start_course: "2025-06-24T10:00:00.000Z",
      duration: "2025-12-24T10:00:00.000Z",
      places: 7,
    },
    link: "/",
  },
];

const ITEMS_PER_PAGE = 6;

const CoursesSection = ({}) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const totalPages = Math.ceil(cardsCourses.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleCards = cardsCourses.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page === currentPage) return;
  
    setCurrentPage(page);
  
    setTimeout(() => {
      const element = document.getElementById("courses");
      if (element) {
        const offset = element.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: offset, behavior: "smooth" });
      }
    }, 0);
  };

  return (
    <section className={classNames(styles.courses, "container")}>
      <div className={styles.courses__container}>
        <SectionInfo
          title="Все наши курсы"
          description="Языковые курсы для любого уровня. Удобный формат, опытные преподаватели и живое общение."
        />
        <div id="courses" className={styles.courses__cards}>
          {visibleCards.map((card, index) => (
            <div key={index} className={styles.courses__wrapper}>
              <div className={styles.courses__info}>
                <div className={styles.courses__title}>
                  <h3>{card.title}</h3>
                </div>
                <div className={styles.courses__description}>
                  <p>{card.description}</p>
                </div>
              </div>
              <div className={styles.courses__detailsBlock}>
                <div className={styles.courses__detail}>
                  <Calendar />
                  <div className={styles.courses__infoDetail}>
                    <span>Запуск курса</span>
                    <p>{dayjs(card.details.start_course).format("DD MMMM YYYY")}</p>
                  </div>
                </div>
                <div className={styles.courses__detail}>
                  <Hours />
                  <div className={styles.courses__infoDetail}>
                    <span>Длительность</span>
                    <p>{dayjs(card.details.duration).diff(card.details.start_course, "month")} месяцев</p>
                  </div>
                </div>
                <div className={styles.courses__detail}>
                  <Place />
                  <div className={styles.courses__infoDetail}>
                    <span>Свободных мест</span>
                    <p>{card.details.places}</p>
                  </div>
                </div>
              </div>
              <div className={styles.courses__more}>
                <Link href={`/courses/${card.slug}`}>
                  Подробнее о курсе
                </Link>
              </div>
            </div>
          ))}
        </div>
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
          />
        )}
      </div>
    </section>
  )
};

export default CoursesSection;