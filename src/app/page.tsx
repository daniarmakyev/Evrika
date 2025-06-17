import Header from "@components/Header";
import AsideButton from "@components/AsideButton";
import Footer from "@components/Footer";
import QuoteSection from "@components/QuoteSection";
import InGroupSection from "@components/InGroupSection";
import CoursesSection from "@components/CoursesSection";
import SignupSection from "@components/SignupSection/indext";

export default function Home() {
  return (
    <>
      <Header />
      <main className="App">
        <AsideButton />
        <QuoteSection />
        <InGroupSection />
        <CoursesSection />
        <SignupSection />
      </main>
      <Footer />
    </>
  );
}
