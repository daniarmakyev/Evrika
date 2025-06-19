import Header from "@components/Header";
import HeroBanner from "@components/HeroBanner";
import StartCoursesSection from "@components/StartCoursesSection";
import SuitableCoursesSection from "@components/SuitableCoursesSection";
import InstructorsSection from "@components/InstructorsSection";
import SignupSection from "@components/SignupSection/indext";
import Footer from "@components/Footer";
import WhatKnowSection from "@components/WhatKnowSection";

const detailCoursesPageBanner = {
  title: "Курс английского языка",
  description: "Курсы для всех уровней — от А1 до С1.",
  image: {
    url: "/assets/images/detail-courses-page.png",
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

const DetailCourses = ({}) => {
  return (
    <>
      <Header />
      <main className="App">
        <HeroBanner data={detailCoursesPageBanner} />
        <StartCoursesSection title="Курс стартует:" description="27 мая 2025" />
        <SuitableCoursesSection />
        <WhatKnowSection />
        <InstructorsSection
          data={imgCards}
          title="Преподаватели"
          description="Наши преподаватели — опытные специалисты, а старшие — с международным опытом работы и преподавания."
        />
        <SignupSection />
      </main>
      <Footer />
    </>
  );
};

export default DetailCourses;