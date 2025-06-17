import Header from "@components/Header";
import SignupSection from "@components/SignupSection/indext";
import Footer from "@components/Footer";
import ContactsSection from "@components/ContactsSection";

const Contacts = ({}) => {
  return (
    <>
      <Header />
      <main className="App">
        <ContactsSection />
        <SignupSection />
      </main>
      <Footer />
    </>
  );
};

export default Contacts;