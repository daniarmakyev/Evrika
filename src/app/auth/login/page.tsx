"use client";
import InputField from "@components/Fields/InputField";
import React from "react";
import Image from "next/image";
import Overlay from "@components/Ui/Overlay";
import styles from "./styles.module.scss";
import FormButton from "@components/Ui/FormButton";
import Link from "next/link";
import { useForm } from "react-hook-form";
import UserIcon from "../../../../public/assets/icons/user.svg";
import LockPasswordIcon from "../../../../public/assets/icons/lock-password.svg";
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
    <Overlay
      style={{
        padding: "10px 20px 30px 20px",
        maxWidth: "840px",
        marginTop: "var(--header-height)",
        maxHeight: "640px",
      }}
    >
      <div className={styles.overlay__innerOverlay}>
        <div>
          <h1 className={styles.overlay__title}>ВХОД</h1>
          <p className={styles.overlay__description}>
            Введите почту и пароль для входа
          </p>
        </div>
        <form
          className={styles.overlay__form}
          onSubmit={handleSubmit(onSubmit)}
        >
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
            leftIcon={<UserIcon />}
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
            leftIcon={<LockPasswordIcon />}
            fullWidth
          />
          <FormButton type="submit" style={{ marginTop: "30px" }}>
            ВОЙТИ
          </FormButton>
        </form>
        <span className={styles.overlay__registration}>
          У вас нет аккаунта? <Link href="/auth/registration">РЕГИСТРАЦИЯ</Link>
        </span>
      </div>
    </Overlay>
  );
};

export default Login;
