import Header from "@components/Header";
import AsideButton from "@components/AsideButton";
import Footer from "@components/Footer";
import QuoteSection from "@components/QuoteSection";
import InGroupSection from "@components/InGroupSection";

export default function Home() {
  return (
    <>
      <Header />
      <main className="App">
        <AsideButton />
        <QuoteSection />
        <InGroupSection />
      </main>
      <Footer />
    </>
  );
}
