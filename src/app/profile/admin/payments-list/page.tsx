"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "src/store/store";
import {
  editFinanceStatus,
  getFinance,
} from "src/store/finance/finance.action";
import { updatePaymentStatus } from "src/store/finance/finance.slice";
import classNames from "classnames";
import styles from "./styles.module.scss";
import Table from "@components/Table";
import InputField from "@components/Fields/InputField";
import SelectField from "@components/Fields/SelectField";
import SearchIcon from "@icons/searchIcon.svg";
import { useModal } from "@context/ModalContext";
import ProfileModal from "@components/ProfileModal";
import { FinanceItem, FinanceTableItem, Check, Group } from "src/consts/types";

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

export default function FinancePage() {
  const dispatch = useAppDispatch();
  const { financeData, financeLoading, financeError } = useAppSelector(
    (state) => state.finance
  );

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

  const checksModal = useModal<ChecksModalData>("checks");

  const statusOptions = [
    { label: "Все статусы", value: "" },
    { label: "Оплачено", value: "Оплачено" },
    { label: "Не оплачено", value: "Не оплачено" },
  ];

  const fetchFinanceData = useCallback(() => {
    const params: any = {
      page: currentPage,
      size: 20,
    };

    if (selectedGroupId) {
      params.group_id = selectedGroupId;
    }

    if (searchTerm.trim()) {
      params.search = searchTerm.trim();
    }

    dispatch(getFinance(params));
  }, [dispatch, selectedGroupId, searchTerm, currentPage]);

  useEffect(() => {
    fetchFinanceData();
  }, [fetchFinanceData]);

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
          onClick={() => window.open(row.check, "_blank")}
          className={styles.checkNameButton}
          title="Посмотреть чек"
        >
          Скачать
        </button>
      ),
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
                    <div className={styles.pagination}>
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(1, prev - 1))
                        }
                        disabled={currentPage === 1}
                        className={styles.paginationButton}
                      >
                        Назад
                      </button>

                      <span className={styles.paginationInfo}>
                        Страница {currentPage} из{" "}
                        {financeData.pagination.total_pages}
                      </span>

                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(
                              financeData.pagination.total_pages,
                              prev + 1
                            )
                          )
                        }
                        disabled={
                          currentPage === financeData.pagination.total_pages
                        }
                        className={styles.paginationButton}
                      >
                        Далее
                      </button>
                    </div>
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
    </div>
  );
}
