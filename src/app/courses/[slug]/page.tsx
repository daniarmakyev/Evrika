import Header from "@components/Header";
import HeroBanner from "@components/HeroBanner";
import SignupSection from "@components/SignupSection/indext";
import Footer from "@components/Footer";
import StartCoursesSection from "@components/StartCoursesSection";

const detailCoursesPageBanner = {
  title: "Курс английского языка",
  description: "Курсы для всех уровней — от А1 до С1.",
  image: {
    url: "/assets/images/detail-courses-page.png",
    name: "courses-page.png",
  },
};

const DetailCourses = ({}) => {
  return (
    <>
      <Header />
      <main className="App">
        <HeroBanner data={detailCoursesPageBanner} />
        <StartCoursesSection title="Курс стартует:" description="27 мая 2025" />
        <SignupSection />
      </main>
      <Footer />
    </>
  );
};

export default DetailCourses;