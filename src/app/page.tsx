import Header from "@components/Header";
import Footer from "@components/Footer";
import HeroBanner from "@components/HeroBanner";
import InGroupSection from "@components/InGroupSection";
import CoursesSection from "@components/CoursesSection";
import SignupSection from "@components/SignupSection/indext";

export default function Home() {
  return (
    <>
      <Header />
      <main className="App">
        <HeroBanner />
        <InGroupSection />
        <CoursesSection />
        <SignupSection />
      </main>
      <Footer />
    </>
  );
}
