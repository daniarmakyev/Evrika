import Header from "../../components/Header";
import styles from "./styles.module.scss";

export default function ErrorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.wrapper}>
      <Header />
      {children}
    </div>
  );
}
