"use client";
import React, { useState } from "react";
import Footer from "@components/Footer";
import Header from "@components/Header";
import HeroBanner from "@components/HeroBanner";
import styles from "./styles.module.scss";
import Table from "@components/Table";
import classNames from "classnames";
import SelectField from "@components/Fields/SelectField";
import Link from "next/link";
import Image from "next/image";
import qr from "../../../public/assets/images/qr.png";

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  role: string;
}

interface Group {
  id: number;
  name: string;
  created_at: string;
  start_date: string;
  end_date: string;
  approximate_lesson_start: string;
  is_active: boolean;
  is_archived: boolean;
  course_id: number;
  teacher_id: number;
}

interface StudentGroup {
  id: number;
  student_id: number;
  group_id: number;
  joined_at: string;
  months_paid: number;
  is_active: boolean;
  price: number;
  current_month_number: number;
  deadline: string;
  status: string;
  group: Group;
  student: Student;
}

const coursesPageBanner = {
  title: "Оплата",
  description: "Присутствует возможность выбора оплаты",
  image: {
    url: "assets/images/finance-banner.svg",
    name: "finance-banner.svg",
  },
};

const mockStudentGroups: StudentGroup[] = [
  {
    id: 0,
    student_id: 0,
    group_id: 0,
    joined_at: "2025-08-19",
    months_paid: 0,
    is_active: true,
    price: 5000,
    current_month_number: 0,
    deadline: "2025-08-19",
    status: "Оплачено",
    group: {
      id: 0,
      name: "Английский-A1-0825",
      created_at: "2025-08-19T15:39:36.788Z",
      start_date: "2025-08-19",
      end_date: "2025-12-19",
      approximate_lesson_start: "15:39:36.788Z",
      is_active: true,
      is_archived: false,
      course_id: 0,
      teacher_id: 0,
    },
    student: {
      id: 0,
      first_name: "Иван",
      last_name: "Иванов",
      email: "ivan@example.com",
      phone_number: "+996123456789",
      role: "student",
    },
  },
];

const columns = [
  {
    key: "group",
    title: "Группа",
    width: "20%",
    render: (value: Group) => value?.name,
  },
  {
    key: "group",
    title: "Окончание курса",
    width: "15%",
    render: (value: Group) => new Date(value?.end_date).toLocaleDateString(),
  },
  {
    key: "price",
    title: "Стоимость",
    width: "15%",
    render: (value: number) => `${value} сом`,
  },
  {
    key: "deadline",
    title: "Дедлайн",
    width: "15%",
    render: (value: string) => new Date(value).toLocaleDateString(),
  },
  {
    key: "status",
    title: "Статус",
    width: "15%",
    render: (value: string) => (
      <span
        className={classNames(styles.status, {
          [styles.paid]: value === "Оплачено",
          [styles.unpaid]: value === "Неоплачено",
        })}
      >
        {value}
      </span>
    ),
  },
];

const FinancePage = () => {
  const [paymentType, setPaymentType] = useState<"offline" | "online">(
    "offline"
  );

  const handlePaymentTypeChange = (type: "offline" | "online") => {
    setPaymentType(type);
  };

  const renderOfflinePayment = () => (
    <div className={styles.finance__pay}>
      <div className={styles.finance__instructions}>
        <h3 className={styles.instructions__title}>
          Для проведения оффлайн-оплаты, пожалуйста, выполните следующие
          действия:
        </h3>
        <ol className={styles.instructions__list}>
          <li>
            Скопируйте или сохраните наш лицевой счёт оплаты, указанный ниже.
          </li>
          <li>
            Наш лицевой счёт:{" "}
            <span className={styles.account}>5414 4132 9831 3123</span>
            <br />
            <span className={styles.note}>
              (Вы можете <a href="#">скопировать</a> его или сделать скриншот)
            </span>
          </li>
          <li>
            Через пост-терминал (в любом удобном для вас месте) выберите способ
            оплаты по номеру карты &quot;Оптима&quot; и введите указанный
            лицевой счёт.
            <br />
            После оплаты сфотографируйте чек, перейдите в профиль, откройте
            вкладку <strong>{'"Чеки"'}</strong>, загрузите фотографию чека и
            ожидайте обратной связи от администратора.
          </li>
        </ol>
        <Link href={"/profile/checks"} className={styles.checkLink}>
          Чеки
        </Link>
      </div>
      <div className={styles.finance__qr}>
        <Image src={qr} width={400} height={400} alt="QR код для оплаты" />
      </div>
    </div>
  );

  const renderOnlinePayment = () => (
    <div className={styles.finance__onlinePayment}>
      <p>Онлайн оплата - в разработке</p>
    </div>
  );

  return (
    <>
      <Header />
      <main className="App">
        <HeroBanner data={coursesPageBanner} button={false} />
        <div className={styles.finance}>
          <div className={classNames("container", styles.finance__container)}>
            <div className={styles.finance__content}>
              <div className={styles.finance__header}>
                <h2 className={styles.finance__title}>Детали об оплате</h2>
                <SelectField
                  isShadow
                  options={[{ label: "dadada", value: "dasdada" }]}
                  label="Выберите группу"
                  labelLeft
                />
              </div>
              <div className={styles.table__container}>
                <Table
                  columns={columns}
                  data={mockStudentGroups}
                  emptyMessage="Студенты не найдены"
                />
              </div>
            </div>

            <div className={styles.finance__content}>
              <h2 className={styles.finance__title}>Оплата</h2>

              <div className={styles.paymentSwitcher}>
                <button
                  className={classNames(styles.paymentSwitcher__button, {
                    [styles.paymentSwitcher__button_active]:
                      paymentType === "offline",
                  })}
                  onClick={() => handlePaymentTypeChange("offline")}
                >
                  Оффлайн оплата
                </button>
                <button
                  className={classNames(styles.paymentSwitcher__button, {
                    [styles.paymentSwitcher__button_active]:
                      paymentType === "online",
                  })}
                  onClick={() => handlePaymentTypeChange("online")}
                >
                  Онлайн оплата
                </button>
              </div>

              {paymentType === "offline"
                ? renderOfflinePayment()
                : renderOnlinePayment()}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default FinancePage;
