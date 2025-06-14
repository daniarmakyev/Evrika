import Link from "next/link";
import Image from "next/image";
import Overlay from "@components/Ui/Overlay";
import styles from "./styles.module.scss";
import ErrorLayout from "./layout";

export default function NotFound() {
  return (
    <ErrorLayout>
      <Overlay
        style={{
          maxWidth: "750px",
          padding: "60px 20px",
          gap: "20px",
        }}
      >
        <div className={styles.innerOverlay}>
          <h1>404</h1>
          <Image
            src="/assets/images/404cat.png"
            alt="not-found"
            width={600}
            height={600}
            priority
          />
          <div className={styles.innerOverlay__text}>
            <h2>Такой страницы нет</h2>
            <Link href="/" className={styles.link}>
              На главную
            </Link>
          </div>
        </div>
      </Overlay>
    </ErrorLayout>
  );
}
