"use client";
import React, { useEffect, useState } from "react";
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
import { Group, Course } from "src/consts/types";
import { useAppDispatch, useAppSelector } from "src/store/store";
import { getMyPayments } from "src/store/finance/finance.action";
import { getCourse } from "src/store/courseGroup/courseGroup.action";
import LoadingSpinner from "@components/Ui/LoadingSpinner";

const coursesPageBanner = {
  title: "Оплата",
  description: "Присутствует возможность выбора оплаты",
  image: {
    url: "assets/images/finance-banner.svg",
    name: "finance-banner.svg",
  },
};

const FinancePage = () => {
  const { myPaymentsError, myPayments, myPaymentsLoading } = useAppSelector(
    (state) => state.finance
  );

  const { error: courseError } = useAppSelector((state) => state.groupsCourses);

  const dispatch = useAppDispatch();

  const [loadedCourses, setLoadedCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  const [statusFilter, setStatusFilter] = useState<string>("");
  const [groupFilter, setGroupFilter] = useState<string>("");

  const loadPayments = (status?: "Оплачено" | "Не оплачено") => {
    dispatch(getMyPayments(status || undefined));
  };

  useEffect(() => {
    loadPayments();
  }, [dispatch]);

  useEffect(() => {
    if (myPayments && myPayments.length > 0) {
      const uniqueCourseIds = Array.from(
        new Set(myPayments.map((payment) => payment.group.course_id))
      );

      if (uniqueCourseIds.length > 0) {
        setLoadingCourses(true);
        setLoadedCourses([]);

        const loadCourses = async () => {
          const courses: Course[] = [];

          for (const courseId of uniqueCourseIds) {
            try {
              const result = await dispatch(getCourse(courseId));
              if (getCourse.fulfilled.match(result)) {
                courses.push(result.payload);
              }
            } catch (error) {
              console.error(`Ошибка загрузки курса ${courseId}:`, error);
            }
          }

          setLoadedCourses(courses);
          setLoadingCourses(false);
        };

        loadCourses();
      }
    }
  }, [myPayments, dispatch]);

  const [paymentType, setPaymentType] = useState<"offline" | "online">(
    "offline"
  );

  const handlePaymentTypeChange = (type: "offline" | "online") => {
    setPaymentType(type);
  };

  const handleStatusFilterChange = (value: "Оплачено" | "Не оплачено") => {
    setStatusFilter(value);
    loadPayments(value);
  };

  const handleGroupFilterChange = (value: string) => {
    setGroupFilter(value);
  };

  const getCoursePrice = (courseId: number): string => {
    const course = loadedCourses.find((c) => c.id === courseId);
    return course ? `${course.price} сом` : "Загружается...";
  };

  const filteredPayments = myPayments?.filter((payment) => {
    if (!groupFilter) return true;
    return payment.group.id.toString() === groupFilter;
  });

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
      key: "group",
      title: "Стоимость курса",
      width: "15%",
      render: (value: Group) => getCoursePrice(value.course_id),
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
            [styles.unpaid]: value === "Не оплачено",
          })}
        >
          {value}
        </span>
      ),
    },
  ];

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

  const statusOptions = [
    { label: "Все статусы", value: "" },
    { label: "Оплачено", value: "Оплачено" },
    { label: "Не оплачено", value: "Не оплачено" },
  ];

  const groupOptions = [
    { label: "Все группы", value: "" },
    ...(myPayments
      ?.map((payment) => ({
        label: payment.group.name,
        value: payment.group.id.toString(),
      }))
      .filter(
        (option, index, self) =>
          index === self.findIndex((o) => o.value === option.value)
      ) || []),
  ];

  const isLoading = myPaymentsLoading || loadingCourses;

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

                <div className={styles.finance__filters}>
                  <SelectField
                    isShadow
                    options={statusOptions}
                    label="Статус платежа"
                    labelLeft
                    value={statusFilter}
                    onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                      handleStatusFilterChange(
                        event.target.value as "Оплачено" | "Не оплачено"
                      )
                    }
                  />

                  <SelectField
                    isShadow
                    options={groupOptions}
                    label="Группа"
                    labelLeft
                    value={groupFilter}
                    onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                      handleGroupFilterChange(event.target.value)
                    }
                  />
                </div>
              </div>

              {isLoading && <LoadingSpinner />}

              {filteredPayments &&
                filteredPayments.length > 0 &&
                !isLoading && (
                  <div className={styles.table__container}>
                    <Table
                      columns={columns}
                      data={filteredPayments}
                      emptyMessage="Платежи не найдены"
                    />
                  </div>
                )}

              {filteredPayments &&
                filteredPayments.length === 0 &&
                !isLoading && (
                  <div className={styles.emptyMessage}>
                    Платежи по выбранным фильтрам не найдены
                  </div>
                )}

              {myPaymentsError && (
                <div className={styles.error}>
                  Ошибка при загрузке данных об оплате
                </div>
              )}

              {courseError && (
                <div className={styles.error}>
                  Ошибка при загрузке курсов: {courseError}
                </div>
              )}
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
