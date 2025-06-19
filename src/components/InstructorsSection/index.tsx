import Image from "next/image";
import classNames from "classnames";
import SectionInfo from "@components/SectionInfo";
import styles from "./styles.module.scss";

const imgCards = [
  {
    name: "Святослав",
    position: "Ассистент преподавателя",
    description: "Выпускник  Эврика",
    image: {
      url: "/assets/images/instructor-1.jpg",
      name: "instructor-1.jpg",
    }
  },
  {
    name: "Светлана",
    position: "Ассистент преподавателя",
    description: "Выпускник  Эврика",
    image: {
      url: "/assets/images/instructor-2.jpg",
      name: "instructor-2.jpg",
    }
  },
  {
    name: "Эмили",
    position: "Преподаватель английского",
    description: "Опыт обучения 8 лет",
    image: {
      url: "/assets/images/instructor-3.jpg",
      name: "instructor-3.jpg",
    }
  },
  {
    name: "Тайсон",
    position: "Преподаватель французского",
    description: "Опыт обучения 10 лет",
    image: {
      url: "/assets/images/instructor-4.jpg",
      name: "instructor-4.jpg",
    }
  },
];

const InstructorsSection = ({}) => {
  return (
    <section className={classNames(styles.instructors, "container")}>
      <div className={styles.instructors__container}>
        <SectionInfo
          title="Преподаватели"
          description="Все наши преподаватели когда-то закончили курсы нашей школы, а старшие преподаватели работают в международных компаниях или преподают за рубежом."
        />
        <div className={styles.instructors__cards}>
          {imgCards.map((item, index) => (
            <div key={index} className={styles.instructors__wrapper}>
              <div className={styles.instructors__image}>
                <Image
                  quality={100}
                  width={300}
                  height={300}
                  src={item.image.url}
                  alt={item.image.name}
                />
                <div className={styles.instructors__info}>
                  <h4>{item.name}</h4>
                  <p>{item.position}</p>
                  <p>{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
};

export default InstructorsSection;