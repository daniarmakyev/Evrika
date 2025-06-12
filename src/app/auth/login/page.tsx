import InputField from "@components/Fields/InputField";
import React from "react";
import Image from "next/image";
import Overlay from "@components/Ui/Overlay";
import styles from "./styles.module.scss";
import FormButton from "@components/Ui/FormButton";
import Link from "next/link";

const Login: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <Overlay
        style={{
          paddingTop:"10px",
          paddingBottom:"30px",
          height: "100%",
          width: "100%",
          maxHeight: "640px",
          maxWidth: "840px",
        }}
      >
        <div className={styles.wrapper__innerOverlay}>
          <div>
            <h2 className={styles.wrapper__title}>Вход</h2>
            <p className={styles.wrapper__description}>
              Введите почту и пароль для входа
            </p>
          </div>
          <form className={styles.wrapper__form}>
            <InputField
              placeholder="почта"
              label="Вход"
              name="почта"
              leftIcon={
                <Image
                  src="/assets/icons/user.svg"
                  alt="user"
                  width={18}
                  height={18}
                  style={{
                    borderRadius: "6px",
                  }}
                />
              }
              fullWidth
            />
            <InputField
              placeholder="пароль"
              label="Пароль"
              name="пароль"
              leftIcon={
                <Image
                  src="/assets/icons/user.svg"
                  alt="user"
                  width={18}
                  height={18}
                  style={{
                    borderRadius: "6px",
                  }}
                />
              }
              fullWidth
            />
            <FormButton type="submit" style={{ marginTop: "20px" }}>
              Войти
            </FormButton>
          </form>
          <span className={styles.wrapper__registration}>
            У вас нет аккаунта? <Link href="/auth/registration">Регистрация</Link>
          </span>
        </div>
      </Overlay>
    </div>
  );
};

export default Login;
