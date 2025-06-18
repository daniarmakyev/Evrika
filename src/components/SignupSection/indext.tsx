'use client';

import React from "react";
import { useForm } from "react-hook-form";
import classNames from "classnames";
import InputField from "@components/Fields/InputField";
import UserId from "@icons/user-id.svg"
import Phone from "@icons/phone.svg"
import UserIcon from "@icons/user.svg"
import styles from "./styles.module.scss";

interface SignupFormData {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
}

const SignupSection: React.FC = ({}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignupFormData>({
    defaultValues: {
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
    },
  });

  const onSubmit = (data: SignupFormData) => {
    console.log("Форма отправлена", data);
    reset();
  };

  return (
    <section id="signup" className={classNames(styles.signup, "container")}>
      <div className={styles.signup__container}>
        <div className={styles.signup__info}>
          <div className={styles.signup__title}>
            <h3>Ответим на все вопросы - начнем вместе!</h3>
          </div>
          <div className={styles.signup__description}>
            <p>Если Вы хотите узнать больше о школе “Эврика”, или не знаете какую программу выбрать - оставьте заявку и наши менеджеры свяжутся с Вами в течении рабочего дня, с 10:00 до 18:00.</p>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.signup__form}>
          <div className={styles.signup__wrapper}>
            <InputField
              label="Имя"
              id="first_name"
              placeholder="Введите имя"
              fullWidth
              leftIcon={<UserId />}
              error={errors.first_name?.message}
              {...register("first_name", { required: "Введите имя" })}
            />
            <InputField
              label="Фамилия"
              id="last_name"
              placeholder="Введите фамилию"
              fullWidth
              leftIcon={<UserId />}
              error={errors.last_name?.message}
              {...register("last_name", { required: "Введите фамилию" })}
            />
            <InputField
              label="Телефон"
              id="phone"
              placeholder="Введите телефон"
              fullWidth
              leftIcon={<Phone />}
              error={errors.phone?.message}
              {...register("phone", {
                required: "Введите номер телефона",
                pattern: {
                  value: /^\+?\d{10,15}$/,
                  message: "Неверный формат телефона",
                },
              })}
            />
            <InputField
              label="Почта"
              id="email"
              placeholder="Введите почту"
              fullWidth
              leftIcon={<UserIcon />}
              error={errors.email?.message}
              {...register("email", {
                required: "Введите email",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Неверный формат email",
                },
              })}
            />
          </div>
          <button type="submit">
            <span>Отправить</span>
          </button>
        </form>
      </div>
    </section>
  )
};

export default SignupSection;