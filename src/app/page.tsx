import Header from "@components/Header";
import Footer from "@components/Footer";
import AsideButton from "@components/AsideButton";

export default function Home() {
  return (
    <>
      <Header />
      <main className="App">
        <AsideButton />
      </main>
      <Footer />
    </>
  );
}
