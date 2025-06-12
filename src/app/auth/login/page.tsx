"use client"
import InputField from "@components/Fields/InputField";
import React from "react";
import Image from "next/image";
import Overlay from "@components/Ui/Overlay";
import styles from "./styles.module.scss";
import FormButton from "@components/Ui/FormButton";
import Link from "next/link";
import { useForm } from "react-hook-form";

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    console.log("Форма отправлена", data);
  };

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
            <h1 className={styles.wrapper__title}>ВХОД</h1>
            <p className={styles.wrapper__description}>
              Введите почту и пароль для входа
            </p>
          </div>
          <form className={styles.wrapper__form} onSubmit={handleSubmit(onSubmit)}>
            <InputField
              placeholder="почта"
              label="Почта"
              {...register("email", {
                required: "Почта обязательна",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Неверный формат почты",
                },
              })}
              error={errors.email?.message}
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
              type="password"
              {...register("password", {
                required: "Пароль обязателен",
                minLength: {
                  value: 6,
                  message: "Пароль должен быть не менее 6 символов",
                },
              })}
              error={errors.password?.message}
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
            <FormButton type="submit" style={{ marginTop: "30px" }}>
              ВОЙТИ
            </FormButton>
          </form>
          <span className={styles.wrapper__registration}>
            У вас нет аккаунта? <Link href="/auth/registration">РЕГИСТРАЦИЯ</Link>
          </span>
        </div>
      </Overlay>
    </div>
  );
};

export default Login;