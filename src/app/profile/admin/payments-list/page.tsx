"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "src/store/store";
import {
  editFinanceStatus,
  getFinance,
  downloadCheck,
  getStripePayments,
} from "src/store/finance/finance.action";
import classNames from "classnames";
import styles from "./styles.module.scss";
import Table from "@components/Table";
import InputField from "@components/Fields/InputField";
import SelectField from "@components/Fields/SelectField";
import SearchIcon from "@icons/searchIcon.svg";
import { useModal } from "@context/ModalContext";
import ProfileModal from "@components/ProfileModal";
import Pagination from "@components/Pagination";
import {
  FinanceTableItem,
  Check,
  Group,
  StripePayment,
} from "src/consts/types";

const TableSkeleton = () => (
  <div className={styles.tableSkeleton}>
    <div className={styles.tableHeaderSkeleton}>
      <div className={styles.skeletonHeaderCell}></div>
      <div className={styles.skeletonHeaderCell}></div>
      <div className={styles.skeletonHeaderCell}></div>
      <div className={styles.skeletonHeaderCell}></div>
    </div>
    <div className={styles.tableBodySkeleton}>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className={styles.tableRowSkeletonDiv}>
          <div className={styles.skeletonCell}></div>
          <div className={styles.skeletonCell}></div>
          <div className={styles.skeletonCell}></div>
          <div className={styles.skeletonButtonCell}></div>
        </div>
      ))}
    </div>
  </div>
);

interface ChecksModalData {
  studentName: string;
  groupName: string;
  groupId: number;
  checks: Check[];
}

interface PaymentHistoryModalData {
  studentName: string;
  studentId: number;
  payments: StripePayment[];
}

export default function FinancePage() {
  const dispatch = useAppDispatch();
  const {
    financeData,
    financeLoading,
    financeError,
    downloadCheckError,
    stripeData,
    stripeLoading,
  } = useAppSelector((state) => state.finance);

  const [filteredFinance, setFilteredFinance] = useState<FinanceTableItem[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState<number | undefined>(
    undefined
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [groupDetails, setGroupDetails] = useState<Group | null>(null);
  const [downloadingCheckId, setDownloadingCheckId] = useState<number | null>(
    null
  );
  const [paymentHistorySort, setPaymentHistorySort] = useState<
    "date-asc" | "date-desc" | "amount-asc" | "amount-desc"
  >("date-desc");

  const checksModal = useModal<ChecksModalData>("checks");
  const paymentHistoryModal =
    useModal<PaymentHistoryModalData>("paymentHistory");

  const statusOptions = [
    { label: "Все статусы", value: "" },
    { label: "Оплачено", value: "Оплачено" },
    { label: "Не оплачено", value: "Не оплачено" },
  ];

  interface FinanceParams {
    page: number;
    size: number;
    group_id?: string | number;
    search?: string;
  }

  const fetchFinanceData = useCallback(() => {
    const params: FinanceParams = {
      page: currentPage,
      size: 20,
    };

    if (selectedGroupId) {
      params.group_id = selectedGroupId;
    }

    if (searchTerm.trim()) {
      params.search = searchTerm.trim();
    }

    const paramsForDispatch = {
      ...params,
      group_id:
        params.group_id !== undefined ? Number(params.group_id) : undefined,
    };

    dispatch(getFinance(paramsForDispatch));
  }, [dispatch, selectedGroupId, searchTerm, currentPage]);

  useEffect(() => {
    fetchFinanceData();
    dispatch(getStripePayments());
  }, [fetchFinanceData, dispatch]);

  useEffect(() => {
    if (financeData?.items) {
      let filtered = financeData.items;

      filtered = filtered.filter(
        (item) =>
          item.student_id !== item.group.teacher_id &&
          item.student_first_name !== "Super"
      );

      if (selectedStatus) {
        filtered = filtered.filter(
          (item) =>
            getPaymentStatus(
              item.months_paid,
              item.current_month_number
            ).toLowerCase() === selectedStatus.toLowerCase()
        );
      }

      const tableData = filtered.map((item) => ({
        id: item.payment_detail_id,
        student_name: `${item.student_first_name} ${item.student_last_name}`,
        group_name: item.group.name,
        payment_status: item.payment_status,
        checks: item.checks,
        group_id: item.group_id,
        student_id: item.student_id,
      }));

      setFilteredFinance(tableData);
    }
  }, [financeData, selectedStatus]);

  const groupOptions = React.useMemo(() => {
    if (!financeData?.items) return [{ label: "Все группы", value: "" }];

    const uniqueGroups = Array.from(
      new Map(
        financeData.items.map((item) => [item.group.id, item.group])
      ).values()
    );

    return [
      { label: "Все группы", value: "" },
      ...uniqueGroups.map((group) => ({
        label: group.name,
        value: group.id.toString(),
      })),
    ];
  }, [financeData]);

  const sortedPaymentHistory = useMemo(() => {
    if (!paymentHistoryModal.data?.payments) return [];

    return [...paymentHistoryModal.data.payments].sort((a, b) => {
      if (paymentHistorySort === "date-asc") {
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      }
      if (paymentHistorySort === "date-desc") {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }
      if (paymentHistorySort === "amount-asc") {
        return a.amount - b.amount;
      }
      if (paymentHistorySort === "amount-desc") {
        return b.amount - a.amount;
      }
      return 0;
    });
  }, [paymentHistoryModal.data?.payments, paymentHistorySort]);

  const getPaymentStatus = (monthsPaid: number, currentMonth: number) => {
    return monthsPaid < currentMonth ? "Не оплачено" : "Оплачено";
  };

  const handleViewChecks = async (financeItem: FinanceTableItem) => {
    const groupData = financeData?.items.find(
      (item) => item.group_id === financeItem.group_id
    )?.group;

    if (groupData) {
      setGroupDetails(groupData as Group);
    }

    checksModal.openModal({
      studentName: financeItem.student_name,
      groupId: financeItem.group_id,
      groupName: financeItem.group_name,
      checks: financeItem.checks,
    });
  };

  const handleViewPaymentHistory = async (financeItem: FinanceTableItem) => {
    const studentPayments =
      stripeData?.filter(
        (payment) => payment.owner_id === financeItem.student_id
      ) || [];

    paymentHistoryModal.openModal({
      studentName: financeItem.student_name,
      studentId: financeItem.student_id,
      payments: studentPayments,
    });
  };

  const handleDownloadCheck = async (check: Check) => {
    setDownloadingCheckId(check.id);
    try {
      await dispatch(
        downloadCheck({
          check_id: check.id,
          filename: check.check.split("/").pop() || `check_${check.id}`,
        })
      ).unwrap();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error downloading check:", error.message);
      } else {
        console.error("Unknown error downloading check:", error);
      }
    } finally {
      setDownloadingCheckId(null);
    }
  };

  const handleStatusChange = (paymentId: number) => {
    const originalPayment = financeData?.items.find(
      (item) => item.payment_detail_id === paymentId
    );
    if (!originalPayment) return;

    const { student_id, group_id, current_month_number, months_paid } =
      originalPayment;

    const isPaid = months_paid >= current_month_number;

    const updatedMonthsPaid = isPaid
      ? Math.max(months_paid - 1, 0)
      : months_paid + 1;

    const newStatus =
      updatedMonthsPaid < current_month_number ? "Не оплачено" : "Оплачено";

    dispatch(
      editFinanceStatus({
        payments_id: paymentId,
        group_id,
        student_id,
        data: {
          current_month_number,
          months_paid: updatedMonthsPaid,
          status: newStatus,
        },
      })
    ).then(() => {
      fetchFinanceData();
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const groupId = value ? parseInt(value) : undefined;
    setSelectedGroupId(groupId);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedStatus(e.target.value);
  };

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

  const financeColumns = [
    {
      key: "group_name",
      title: "Группа",
      width: "200px",
    },
    {
      key: "student_name",
      title: "ФИО",
      width: "200px",
    },
    {
      key: "actions",
      title: "Чеки",
      width: "100px",
      isButton: true,
      render: (_: string, row: FinanceTableItem) => (
        <div className={styles.actionButtons}>
          <button
            onClick={() => handleViewChecks(row)}
            className={styles.actionButton}
            title="Посмотреть чеки"
          >
            Чеки ({row.checks.length})
          </button>
        </div>
      ),
    },
    {
      key: "payment_history",
      title: "История",
      width: "120px",
      isButton: true,
      render: (_: string, row: FinanceTableItem) => {
        const studentPayments =
          stripeData?.filter(
            (payment) => payment.owner_id === row.student_id
          ) || [];

        return (
          <div className={styles.actionButtons}>
            <button
              onClick={() => handleViewPaymentHistory(row)}
              className={styles.actionButton}
              title="История платежей"
              disabled={stripeLoading}
            >
              История ({studentPayments.length})
            </button>
          </div>
        );
      },
    },
    {
      key: "payment_status",
      title: "Оплата",
      width: "150px",
      isButton: true,
      render: (_: string, row: FinanceTableItem) => {
        const originalPayment = financeData?.items.find(
          (item) => item.payment_detail_id === row.id
        );

        const status = originalPayment
          ? getPaymentStatus(
              originalPayment.months_paid,
              originalPayment.current_month_number
            )
          : row.payment_status;

        return (
          <button
            onClick={() => handleStatusChange(row.id)}
            className={classNames(styles.statusBadge, {
              [styles.paid]: status === "Оплачено",
              [styles.unpaid]: status === "Не оплачено",
            })}
          >
            {status}
          </button>
        );
      },
    },
  ];

  const checksColumns = [
    {
      key: "group_name",
      title: "Группа",
      width: "150px",
      render: () =>
        groupDetails?.name || checksModal.data?.groupName || "Загрузка...",
    },
    {
      key: "uploaded_at",
      title: "Дата отправки",
      width: "150px",
      render: (value: string) => new Date(value).toLocaleDateString("ru-RU"),
    },
    {
      key: "check",
      title: "Скачать",
      width: "150px",
      isButton: true,
      render: (_: string, row: Check) => (
        <button
          onClick={() => handleDownloadCheck(row)}
          className={styles.checkNameButton}
          title="Скачать чек"
          disabled={downloadingCheckId === row.id}
        >
          {downloadingCheckId === row.id ? "Скачивание..." : "Скачать"}
        </button>
      ),
    },
  ];

  const paymentHistoryColumns = [
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
      render: (value: number, row: StripePayment) => `${value} ${row.currency}`,
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
      render: (_: any, row: StripePayment) => row.group?.name || "-",
    },
  ];

  return (
    <div>
      <div className={classNames(styles.courses__container, "container")}>
        <div className={styles.content}>
          <div className={styles.contentHeader}>
            <div className={styles.filtersContainer}>
              <h3 className={styles.title}>Финансы</h3>

              <div className={styles.searchField}>
                <InputField
                  leftIcon={<SearchIcon />}
                  isShadow
                  placeholder="Поиск по ФИО или группе..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>

              <div className={styles.selectField}>
                <SelectField
                  options={groupOptions}
                  isShadow
                  value={selectedGroupId?.toString() || ""}
                  onChange={handleGroupChange}
                  placeholder="Выберите группу"
                />
              </div>

              <div className={styles.selectField}>
                <SelectField
                  options={statusOptions}
                  isShadow
                  value={selectedStatus}
                  onChange={handleStatusFilterChange}
                  placeholder="Статус оплаты"
                />
              </div>
            </div>
          </div>

          <div className={styles.tableContainer}>
            {financeLoading ? (
              <TableSkeleton />
            ) : financeError ? (
              <div className={styles.error}>
                Ошибка загрузки финансовых данных. Попробуйте обновить страницу.
              </div>
            ) : (
              <>
                <Table
                  columns={financeColumns}
                  data={filteredFinance}
                  emptyMessage="Данные о финансах не найдены"
                />

                {financeData?.pagination &&
                  financeData.pagination.total_pages > 1 && (
                    <Pagination
                      totalPages={financeData.pagination.total_pages}
                      currentPage={currentPage}
                      handlePageChange={handlePageChange}
                    />
                  )}
              </>
            )}
          </div>
        </div>
      </div>

      <ProfileModal
        isOpen={checksModal.isOpen}
        onClose={checksModal.closeModal}
        title={`Чеки - ${checksModal.data?.studentName || ""}`}
        size="xl"
      >
        {checksModal.data && (
          <div className={styles.checksModalContent}>
            {downloadCheckError && (
              <div className={styles.error__message}>
                <span className={styles.error__text}>{downloadCheckError}</span>
              </div>
            )}
            <div className={styles.tableContainer}>
              <Table
                columns={checksColumns}
                data={checksModal.data.checks}
                emptyMessage="Чеки не найдены"
              />
            </div>
          </div>
        )}
      </ProfileModal>

      <ProfileModal
        isOpen={paymentHistoryModal.isOpen}
        onClose={paymentHistoryModal.closeModal}
        title={`История платежей - ${
          paymentHistoryModal.data?.studentName || ""
        }`}
        size="xl"
      >
        {paymentHistoryModal.data && (
          <div className={styles.paymentsModalContent}>
            <div className={styles.payments__filters}>
              <SelectField
                label="Сортировка"
                value={paymentHistorySort}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(e) => setPaymentHistorySort(e.target.value as any)}
                options={[
                  { value: "date-desc", label: "По дате ↓" },
                  { value: "date-asc", label: "По дате ↑" },
                  { value: "amount-desc", label: "По сумме ↓" },
                  { value: "amount-asc", label: "По сумме ↑" },
                ]}
              />
            </div>
            <div className={styles.tableContainer}>
              <Table
                columns={paymentHistoryColumns}
                data={sortedPaymentHistory}
                emptyMessage="История платежей не найдена"
              />
            </div>
            {stripeLoading && <p>Загрузка платежей...</p>}
          </div>
        )}
      </ProfileModal>
    </div>
  );
}
