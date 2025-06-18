import Header from "@components/Header";
import Footer from "@components/Footer";
import HeroBanner from "@components/HeroBanner";
import GroupSection from "@components/GroupSection";
import CoursesSection from "@components/CoursesSection";
import SignupSection from "@components/SignupSection/indext";

export default function Home() {
  return (
    <>
      <Header />
      <main className="App">
        <HeroBanner />
        <GroupSection />
        <CoursesSection />
        <SignupSection />
      </main>
      <Footer />
    </>
  );
}
