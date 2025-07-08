import Header from "@components/Header";
import SignupSection from "@components/SignupSection/indext";
import Footer from "@components/Footer";
import ContactsSection from "@components/ContactsSection";
import AsideButton from "@components/AsideButton";

const Contacts = ({}) => {
  return (
    <>
      <Header />
      <main className="App">
        <ContactsSection />
        <AsideButton />
        <SignupSection />
      </main>
      <Footer />
    </>
  );
};

export default Contacts;
