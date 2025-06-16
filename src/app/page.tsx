import Header from "@components/Header";
import AsideButton from "@components/AsideButton";
import Footer from "@components/Footer";

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
