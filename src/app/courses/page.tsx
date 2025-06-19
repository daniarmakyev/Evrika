import Header from "@components/Header";
import HeroBanner from "@components/HeroBanner";
import Footer from "@components/Footer";
import SignupSection from "@components/SignupSection/indext";
import CoursesSection from "@components/CoursesSection";

const coursesPageBanner = {
  title: "Наши языковые курсы",
  description: "Курсы для всех уровней — от А1 до С1.",
  image: {
    url: "/assets/images/courses-page.png",
    name: "courses-page.png",
  },
};

const Courses = ({}) => {
  return (
    <>
      <Header />
      <main className="App">
        <HeroBanner data={coursesPageBanner} />
        <CoursesSection />
        <SignupSection />
      </main>
      <Footer />
    </>
  );
};

export default Courses;