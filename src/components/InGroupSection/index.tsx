import Image from "next/image";
import classNames from "classnames";
import InfoSection from "@components/InfoSection";
import styles from "./styles.module.scss";

const cards = [
  {
    title: "Никакой зубрежки",
    description: "Грамматика перестаёт быть теорией - вы используете её там, где она ействительно нужно на практике.",
    img: "/assets/icons/icon-1.svg",
  },
  {
    title: "Удобная платформа",
    description: "С доступом 24/7 к учебным материалам и интерактивным чатом для самообучения.",
    img: "/assets/icons/icon-2.svg",
  },
  {
    title: "Обратная связь",
    description: "Каждый ученик в центре внимания. Преподаватель направляет, подсказывает, исправляет ошибки.",
    img: "/assets/icons/icon-3.svg",
  },
  {
    title: "Материалы под ваши интересы",
    description: "Подборка контента, сформированная с учётом ваших интересов и предпочтений.",
    img: "/assets/icons/icon-4.svg",
  },
  {
    title: "Программа под ваши цели",
    description: "Искусственный интеллект помогает преподавателю выстроить общий план обучения, который учитывает цели каждого участника, чтобы все двигались к результату вместе.",
    img: "/assets/icons/icon-5.svg",
  },
];

const InGroupSection = ({}) => {
  return (
    <section className={classNames(styles.group, "container")}>
      <div className={styles.group__container}>
        <InfoSection
          title="Это работает в группе"
          description="В “Эврике”, не вы подстраиваетесь под образовательную программу, а она - под Вас. Вот благодаря чему это происходит:"
        />
        <div className={styles.group__cards}>
          {cards.map((card, index) => (
            <div key={index} className={classNames(styles.group__wrapper, {
              [styles.group__wrapper_grow1]: cards.length % 3 === 1 && index === cards.length - 1,
              [styles.group__wrapper_grow2]: cards.length % 3 === 2 && (index === cards.length - 2 || index === cards.length - 1),
            })}>
              <Image
                width={100}
                height={100}
                src={card.img}
                alt={card.title}
              />
              <div className={styles.group__wrappew__title}>
                <h3>{card.title}</h3>
              </div>
              <div className={styles.group__wrapper__description}>
                <p>{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
};

export default InGroupSection;