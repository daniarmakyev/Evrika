import Header from "@components/Header";
import HeroBanner from "@components/HeroBanner";
import CoursesSection from "@components/CoursesSection";
import InstructorsSection from "@components/InstructorsSection";
import SignupSection from "@components/SignupSection/indext";
import Footer from "@components/Footer";
import AsideButton from "@components/AsideButton";

const coursesPageBanner = {
  title: "Наши языковые курсы",
  description: "Курсы для всех уровней — от А1 до С1.",
  image: {
    url: "/assets/images/courses-page.png",
    name: "courses-page.png",
  },
};

const imgCards = [
  {
    name: "Святослав",
    position: "Ассистент преподавателя",
    description: "Выпускник  Эврика",
    image: {
      url: "/assets/images/instructor-1.jpg",
      name: "instructor-1.jpg",
    },
  },
  {
    name: "Светлана",
    position: "Ассистент преподавателя",
    description: "Выпускник  Эврика",
    image: {
      url: "/assets/images/instructor-2.jpg",
      name: "instructor-2.jpg",
    },
  },
  {
    name: "Эмили",
    position: "Преподаватель английского",
    description: "Опыт обучения 8 лет",
    image: {
      url: "/assets/images/instructor-3.jpg",
      name: "instructor-3.jpg",
    },
  },
  {
    name: "Тайсон",
    position: "Преподаватель французского",
    description: "Опыт обучения 10 лет",
    image: {
      url: "/assets/images/instructor-4.jpg",
      name: "instructor-4.jpg",
    },
  },
];

const Courses = ({}) => {
  return (
    <>
      <Header />
      <main className="App">
        <HeroBanner data={coursesPageBanner} />
        <AsideButton />
        <CoursesSection />
        <InstructorsSection
          data={imgCards}
          title="Преподаватели"
          description="Все наши преподаватели когда-то закончили курсы нашей школы, а старшие преподаватели работают в международных компаниях или преподают за рубежом."
        />
        <SignupSection />
      </main>
      <Footer />
    </>
  );
};

export default Courses;
