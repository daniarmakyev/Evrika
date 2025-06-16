import Header from "@components/Header";
import AsideButton from "@components/AsideButton";
import Footer from "@components/Footer";
import QuoteSection from "@components/QuoteSection";

export default function Home() {
  return (
    <>
      <Header />
      <main className="App">
        <AsideButton />
        <QuoteSection />
      </main>
      <Footer />
    </>
  );
}
