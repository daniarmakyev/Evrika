import Header from "@components/Header";
import HeroBanner from "@components/HeroBanner";
import SignupSection from "@components/SignupSection/indext";
import Footer from "@components/Footer";
import SheduleSection from "@components/SheduleSection";

const shedulePageBanner = {
  title: "Расписание",
  description: "Выберите удобное время для занятий и учитесь с нами!",
  image: {
    url: "/assets/images/shedule-banner.png",
    name: "shedule-banner.png",
  },
};

const Shedule = ({}) => {
  return (
    <>
      <Header />
      <main className="App">
        <HeroBanner data={shedulePageBanner} />
        <SheduleSection />
        <SignupSection />
      </main>
      <Footer />
    </>
  )
};

export default Shedule;