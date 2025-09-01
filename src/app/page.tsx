import Header from "@components/Header";
import Footer from "@components/Footer";
import HeroBanner from "@components/HeroBanner";
import GroupSection from "@components/GroupSection";

const homePageBanner = {
  title: "От первых слов - к свободной речи",
  description: "Запишись на пробный урок - шаг к свободному общению!",
  image: {
    url: "/assets/images/quote.png",
    name: "quote.png",
  },
};

export default function Home() {
  return (
    <>
      <Header />
      <main className="App">
        <HeroBanner data={homePageBanner} />
        {/* <AsideButton /> */}
        <GroupSection />
        {/* <ComingCoursesSection />
        <SignupSection /> */}
      </main>
      <Footer />
    </>
  );
}
