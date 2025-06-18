import classNames from "classnames";
import styles from "./styles.module.scss";

const contacts = [
  {
    label: "Адрес:",
    name: "​Бишкек, Микрорайон Асанбай, 27/1",
  },
  {
    label: "Телефон:",
    name: "+996 (554) 450-026",
    link: "tel:+996554450026",
  },
  {
    label: "Почта:",
    name: "hello@reviro.io",
    link: "mailto:hello@reviro.io",
  },
];

const ContactsSection = ({}) => {
  return (
    <section className={classNames(styles.contacts, "container")}>
      <div className={styles.contacts__container}>
        <div className={styles.contacts__text}>
          <div className={styles.contacts__title}>
            <h1>Контакты</h1>
          </div>
          <div className={styles.contacts__description}>
            <p>Хотите узнать больше? Напишите или позвоните — мы на связи!</p>
          </div>
        </div>
        <div className={styles.contacts__infoBlock}>
          {contacts.map((contact, intex) => (
            <div key={intex} className={styles.contacts__info}>
              <span>{contact.label}</span>
              {!contact.link ? <p>{contact.name}</p> : <a href={contact.link}>{contact.name}</a>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactsSection;