import Link from "next/link";
import Image from "next/image";
import ErrorLayout from "./layout";
import Overlay from "@components/Ui/Overlay";
import styles from "./styles.module.scss";

export default function NotFound() {
  return (
    <ErrorLayout>
      <Overlay className={styles.wrapper__notFound}>
        <div className={styles.wrapper__notFound__innerOverlay}>
          <h1 className={styles.wrapper__notFound__innerOverlay__errorCode}>
            404
          </h1>
          <Image
            src="/assets/images/404cat.png"
            alt="not-found"
            width={600}
            height={600}
            priority
          />
          <div className={styles.wrapper__notFound__innerOverlay__text}>
            <h2 className={styles.title}>Такой страницы нет</h2>
            <Link href="/" className={styles.link}>
              На главную
            </Link>
          </div>
        </div>
      </Overlay>
    </ErrorLayout>
  );
}