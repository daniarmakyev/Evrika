"use client";

import { useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "src/store/store";

import Table from "@components/Table";
import SelectField from "@components/Fields/SelectField";
import styles from "./styles.module.scss";
import { getStripePayments } from "src/store/finance/finance.action";
import classNames from "classnames";

export default function StudentPaymentsPage() {
  const dispatch = useAppDispatch();
  const { stripeData, stripeLoading } = useAppSelector(
    (state) => state.finance
  );

  const [sort, setSort] = useState<
    "date-asc" | "date-desc" | "amount-asc" | "amount-desc"
  >("date-desc");

  useEffect(() => {
    dispatch(getStripePayments());
  }, [dispatch]);

  const sortedPayments = useMemo(() => {
    if (!stripeData) return [];

    return [...stripeData].sort((a, b) => {
      if (sort === "date-asc") {
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      }
      if (sort === "date-desc") {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }
      if (sort === "amount-asc") {
        return a.amount - b.amount;
      }
      if (sort === "amount-desc") {
        return b.amount - a.amount;
      }
      return 0;
    });
  }, [stripeData, sort]);

  const statusMap: Record<string, { label: string; style: string }> = {
    paid: { label: "Оплачено", style: styles["payments__status--paid"] },
    pending: {
      label: "В ожидании",
      style: styles["payments__status--pending"],
    },
    failed: { label: "Неудачно", style: styles["payments__status--failed"] },
    cancelled: {
      label: "Отменено",
      style: styles["payments__status--cancelled"],
    },
  };

  const columns = [
    {
      key: "created_at",
      title: "Дата",
      width: "200px",
      render: (value: string) =>
        new Date(value).toLocaleDateString("ru-RU", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
    {
      key: "amount",
      title: "Сумма",
      width: "150px",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (value: number, row: any) => `${value} ${row.currency}`,
    },
    {
      key: "payment_status",
      title: "Статус",
      width: "180px",
      render: (value: string) => {
        const status = statusMap[value] || { label: value, style: "" };
        return (
          <span className={`${styles["payments__status"]} ${status.style}`}>
            {status.label}
          </span>
        );
      },
    },
    {
      key: "group",
      title: "Группа",
      width: "200px",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, row: any) => row.group?.name || "-",
    },
  ];

  return (
    <div className={classNames(styles.payments__container, "container")}>
      <div className={styles.payments__content}>
        <h2 className={styles.payments__title}>Мои платежи</h2>

        <div className={styles.payments__filters}>
          <SelectField
            label="Сортировка"
            value={sort}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={(e) => setSort(e.target.value as any)}
            options={[
              { value: "date-desc", label: "По дате ↓" },
              { value: "date-asc", label: "По дате ↑" },
              { value: "amount-desc", label: "По сумме ↓" },
              { value: "amount-asc", label: "По сумме ↑" },
            ]}
          />
        </div>
        <div className={styles.payments__table}>
          <Table
            columns={columns}
            data={sortedPayments}
            emptyMessage="Нет платежей"
          />
        </div>

        {stripeLoading && <p>Загрузка платежей...</p>}
      </div>
    </div>
  );
}
