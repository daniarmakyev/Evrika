"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "src/store/store";
import {
  getMyPayments,
  getPaymentRequisites,
  stripePayments,
} from "src/store/finance/finance.action";
import {
  getCourse,
  getCourses,
} from "src/store/courseGroup/courseGroup.action";
import Footer from "@components/Footer";
import Header from "@components/Header";
import HeroBanner from "@components/HeroBanner";
import styles from "./styles.module.scss";
import Table from "@components/Table";
import classNames from "classnames";
import SelectField from "@components/Fields/SelectField";
import Link from "next/link";
import Image from "next/image";
import LoadingSpinner from "@components/Ui/LoadingSpinner";
import { Group, Course } from "src/consts/types";

const coursesPageBanner = {
  title: "Оплата",
  description: "Присутствует возможность выбора оплаты",
  image: {
    url: "assets/images/finance-banner.svg",
    name: "finance-banner.svg",
  },
};

const FinancePage = () => {
  const dispatch = useAppDispatch();

  const {
    myPaymentsError,
    myPayments,
    myPaymentsLoading,
    paymentRequisites,
    paymentRequisitesLoading,
    paymentRequisitesError,
    stripeSession,
  } = useAppSelector((state) => state.finance);

  const {
    error: courseError,
    courses: allCourses,
    loadingCourses,
  } = useAppSelector((state) => state.groupsCourses);

  const [loadedCourses, setLoadedCourses] = useState<Course[]>([]);
  const [courseLoading, setcourseLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [groupFilter, setGroupFilter] = useState<string>("");
  const [paymentType, setPaymentType] = useState<"offline" | "online">(
    "offline"
  );

  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [stripeLoading, setStripeLoading] = useState(false);
  const [stripeError, setStripeError] = useState<string | null>(null);

  const loadPayments = useCallback(
    (status?: "Оплачено" | "Не оплачено") => {
      dispatch(getMyPayments(status || undefined));
    },
    [dispatch]
  );

  useEffect(() => {
    loadPayments();
    dispatch(getPaymentRequisites());

    dispatch(getCourses());
  }, [dispatch, loadPayments]);

  useEffect(() => {
    if (myPayments && myPayments.length > 0) {
      const uniqueCourseIds = Array.from(
        new Set(myPayments.map((payment) => payment.group.course_id))
      );

      if (uniqueCourseIds.length > 0) {
        setcourseLoading(true);
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
          setcourseLoading(false);
        };

        loadCourses();
      }
    }
  }, [myPayments, dispatch]);

  useEffect(() => {
    if (stripeSession?.checkout_url) {
      window.location.href = stripeSession.checkout_url;
    }
  }, [stripeSession]);

  const handlePaymentTypeChange = (type: "offline" | "online") => {
    setPaymentType(type);

    if (type === "offline") {
      setSelectedCourse("");
      setStripeError(null);
    }
  };

  const handleStatusFilterChange = (value: "Оплачено" | "Не оплачено") => {
    setStatusFilter(value);
    loadPayments(value);
  };

  const handleGroupFilterChange = (value: string) => {
    setGroupFilter(value);
  };

  const handleCopyAccount = (account: string) => {
    navigator.clipboard.writeText(account);
    alert("Лицевой счет скопирован!");
  };

  const handleCourseSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCourse(event.target.value);
    setStripeError(null);
  };

  const handleStripePayment = async () => {
    if (!selectedCourse) {
      setStripeError("Пожалуйста, выберите курс для оплаты");
      return;
    }

    const selectedCourseData = allCourses?.find(
      (course) => course.id.toString() === selectedCourse
    );

    if (!selectedCourseData) {
      setStripeError("Выбранный курс не найден");
      return;
    }

    setStripeLoading(true);
    setStripeError(null);

    try {
      const payload = {
        group_id: selectedCourseData.id,
        amount: selectedCourseData.price,
        currency: "kgs",
        success_url: `${window.location.origin}/finance`,
        cancel_url: `${window.location.origin}/finance`,
      };

      const result = await dispatch(stripePayments(payload));

      if (stripePayments.rejected.match(result)) {
        setStripeError(result.payload || "Ошибка создания платежа");
      }
    } catch (error) {
      console.error("Stripe payment error:", error);
      setStripeError("Произошла ошибка при создании платежа");
    } finally {
      setStripeLoading(false);
    }
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

  const renderOfflinePayment = () => {
    const currentRequisite = paymentRequisites?.[0];

    if (paymentRequisitesLoading) {
      return (
        <div className={styles.finance__pay}>
          <LoadingSpinner />
          <p>Загружаем реквизиты...</p>
        </div>
      );
    }

    if (paymentRequisitesError || !currentRequisite) {
      return (
        <div className={styles.finance__pay}>
          <div className={styles.finance__instructions}>
            <h3 className={styles.instructions__title}>
              Ошибка загрузки реквизитов
            </h3>
            <p>Попробуйте обновить страницу или обратитесь к администратору.</p>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.finance__pay}>
        <div className={styles.finance__instructions}>
          <h3 className={styles.instructions__title}>
            Для проведения оплаты используйте наш лицевой счет или QR-код:
          </h3>
          <ul className={styles.instructions__list}>
            <li>
              Скопируйте или сохраните наш лицевой счёт оплаты, указанный ниже.
            </li>
            <li>
              Наш лицевой счёт:{" "}
              <span className={styles.account}>
                <b>{currentRequisite.account}</b>
              </span>
              <br />
              <span>
                Банк: <b>{currentRequisite.bank_name}</b>
              </span>
              <br />
              <span className={styles.note}>
                (Вы можете{" "}
                <button
                  type="button"
                  onClick={() => handleCopyAccount(currentRequisite.account)}
                  className={styles.copyText}
                >
                  скопировать
                </button>{" "}
                его, сделать скриншот или оплатить напрямую через QR-код)
              </span>
            </li>
            <li>
              Оплатите одним из способов:
              <ol>
                <li>Через мобильное банковское приложение</li>
                <li>Через пост-терминал в любом удобном месте</li>
                <li>
                  Сканировав QR-код через мобильное банковское приложение{" "}
                  <span style={{ fontStyle: "italic", color: "#555" }}>
                    (работает только с местными банками и если QR-код доступен)
                  </span>
                </li>
              </ol>
              После оплаты сфотографируйте чек (если он есть), перейдите в
              профиль, откройте вкладку <strong>&quot;Чеки&quot;</strong>,
              загрузите фото и ожидайте подтверждения от администратора.
            </li>
          </ul>
          <Link href="/profile/checks" className={styles.checkLink}>
            Чеки
          </Link>
        </div>
        <div className={styles.finance__qr}>
          <Image
            src={currentRequisite.qr}
            width={400}
            height={400}
            alt="QR код для оплаты"
          />
        </div>
      </div>
    );
  };

  const renderOnlinePayment = () => {
    const courseOptions = [
      { label: "Выберите курс для оплаты", value: "" },
      ...(allCourses?.map((course) => ({
        label: `${course.name} - ${course.price} сом`,
        value: course.id.toString(),
      })) || []),
    ];

    const selectedCourseData = allCourses?.find(
      (course) => course.id.toString() === selectedCourse
    );

    return (
      <div className={styles.finance__onlinePayment}>
        <div className={styles.stripePayment}>
          <h3 className={styles.stripePayment__title}>
            Оплата банковской картой
          </h3>

          {loadingCourses ? (
            <div className={styles.stripePayment__loading}>
              <p>Загружаем список курсов...</p>
            </div>
          ) : (
            <div className={styles.stripePayment__form}>
              <SelectField
                isShadow
                options={courseOptions}
                label="Курс для оплаты"
                labelLeft
                value={selectedCourse}
                onChange={handleCourseSelect}
                placeholder="Выберите курс"
                disabled={stripeLoading}
              />

              {stripeError && (
                <div className={styles.stripeError}>{stripeError}</div>
              )}

              <button
                className={classNames(styles.stripePayment__button, {
                  [styles.stripePayment__button_disabled]:
                    !selectedCourse || stripeLoading,
                })}
                onClick={handleStripePayment}
                disabled={!selectedCourse || stripeLoading}
              >
                {stripeLoading ? (
                  <>
                    <LoadingSpinner />
                    Создание платежа...
                  </>
                ) : (
                  `Оплатить ${
                    selectedCourseData ? `${selectedCourseData.price} сом` : ""
                  }`
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

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

  const isLoading = myPaymentsLoading || courseLoading;

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
                  По лицевому счету и QR-коду
                </button>
                <button
                  className={classNames(styles.paymentSwitcher__button, {
                    [styles.paymentSwitcher__button_active]:
                      paymentType === "online",
                  })}
                  onClick={() => handlePaymentTypeChange("online")}
                >
                  Оплата visa/mastercard
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
