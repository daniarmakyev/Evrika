"use client";

import React, { useEffect, useState } from "react";
import classNames from "classnames";
import styles from "./styles.module.scss";
import Table from "@components/Table";
import InputField from "@components/Fields/InputField";
import SelectField from "@components/Fields/SelectField";
import SearchIcon from "@icons/searchIcon.svg";
import { useModal } from "@context/ModalContext";
import ProfileModal from "@components/ProfileModal";
import { FinanceItem, FinanceTableItem, Check, Group } from "src/consts/types";

const mockFinanceData: FinanceItem[] = [
  {
    student_id: 1,
    student_first_name: "Аскар",
    student_last_name: "Шаршенбеков",
    group_id: 1,
    payment_detail_id: 1,
    months_paid: 1,
    current_month_number: 1,
    payment_status: "Не оплачено",
    group: {
      id: 1,
      name: "Английский-B1-0825-1",
      created_at: "2025-08-14T09:13:06.586770Z",
      start_date: "2025-08-14",
      end_date: "2025-08-14",
      approximate_lesson_start: "09:11:35.981000",
      is_active: true,
      is_archived: false,
      course_id: 1,
      teacher_id: 2,
      teacher: {
        id: 2,
        first_name: "Иван",
        last_name: "Иванов",
        email: "",
        phone_number: "",
        role: "",
        password: null,
      },
    },
    checks: [
      {
        id: 1,
        check: "check_001.jpg",
        student_id: 1,
        group_id: 1,
        uploaded_at: "2025-08-14T10:30:00Z",
      },
      {
        id: 2,
        check: "check_002.jpg",
        student_id: 1,
        group_id: 1,
        uploaded_at: "2025-08-14T11:15:00Z",
      },
    ],
    group_course_name: "Английский-B1",
  },
  {
    student_id: 3,
    student_first_name: "Бегимай",
    student_last_name: "Абдылдаева",
    group_id: 1,
    payment_detail_id: 3,
    months_paid: 1,
    current_month_number: 1,
    payment_status: "Не оплачено",
    group: {
      id: 1,
      name: "Английский-B1-0825-1",
      created_at: "2025-08-14T09:13:06.586770Z",
      start_date: "2025-08-14",
      end_date: "2025-08-14",
      approximate_lesson_start: "09:11:35.981000",
      is_active: true,
      is_archived: false,
      course_id: 1,
      teacher_id: 2,
      teacher: {
        id: 2,
        first_name: "Иван",
        last_name: "Иванов",
        email: "",
        phone_number: "",
        role: "",
        password: null,
      },
    },
    checks: [
      {
        id: 3,
        check: "check_003.jpg",
        student_id: 3,
        group_id: 1,
        uploaded_at: "2025-08-14T12:00:00Z",
      },
    ],
    group_course_name: "Английский-B1",
  },
  {
    student_id: 2,
    student_first_name: "Болот",
    student_last_name: "Калыков",
    group_id: 1,
    payment_detail_id: 2,
    months_paid: 1,
    current_month_number: 1,
    payment_status: "Оплачено",
    group: {
      id: 1,
      name: "Английский-B1-0825-1",
      created_at: "2025-08-14T09:13:06.586770Z",
      start_date: "2025-08-14",
      end_date: "2025-08-14",
      approximate_lesson_start: "09:11:35.981000",
      is_active: true,
      is_archived: false,
      course_id: 1,
      teacher_id: 2,
      teacher: {
        id: 2,
        first_name: "Иван",
        last_name: "Иванов",
        email: "",
        phone_number: "",
        role: "",
        password: null,
      },
    },
    checks: [],
    group_course_name: "Английский-B1",
  },
];

const mockGroupData: Group = {
  id: 1,
  name: "Английский-B1-0825-1",
  created_at: "2025-08-14T09:13:06.586770Z",
  start_date: "2025-08-14",
  end_date: "2025-08-14",
  approximate_lesson_start: "09:11:35.981000",
  is_active: true,
  is_archived: false,
  course_id: 1,
  teacher_id: 2,
  teacher: {
    id: 2,
    first_name: "Иван",
    last_name: "Иванов",
    email: "",
    phone_number: "",
    role: "",
    password: null,
  },
  course: {
    id: 1,
    name: "Английский язык",
    price: 5000,
    description: "Курс английского языка уровня B1",
    language_id: 1,
    level_id: 1,
    language_name: "Английский",
    level_code: "B1",
    created_at: "2025-08-14T09:00:00Z",
  },
};

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
  const [filteredFinance, setFilteredFinance] = useState<FinanceTableItem[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [groupDetails, setGroupDetails] = useState<Group | null>(null);
  const [, setLoadingGroupDetails] = useState(false);

  const checksModal = useModal<ChecksModalData>("checks");

  const statusOptions = [
    { label: "Оплачено", value: "Оплачено" },
    { label: "Не оплачено", value: "Не оплачено" },
  ];

  const fetchGroupDetails = async (): Promise<Group> => {
    setLoadingGroupDetails(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        setLoadingGroupDetails(false);
        resolve(mockGroupData);
      }, 500);
    });
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      let filtered = mockFinanceData;

      if (searchTerm) {
        filtered = filtered.filter(
          (item) =>
            `${item.student_first_name} ${item.student_last_name}`
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            item.group.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (selectedStatus) {
        filtered = filtered.filter(
          (item) =>
            item.payment_status.toLowerCase() === selectedStatus.toLowerCase()
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
      setLoading(false);
    }, 1000);
  }, [searchTerm, selectedStatus]);

  const handleViewChecks = async (financeItem: FinanceTableItem) => {
    const groupData = await fetchGroupDetails();
    setGroupDetails(groupData);

    checksModal.openModal({
      studentName: financeItem.student_name,
      groupId: financeItem.group_id,
      groupName: financeItem.group_name,
      checks: financeItem.checks,
    });
  };

  const handleStatusChange = (paymentId: number) => {
    setFilteredFinance((prev) =>
      prev.map((item) =>
        item.id === paymentId
          ? {
              ...item,
              payment_status:
                item.payment_status === "Оплачено" ? "Не оплачено" : "Оплачено",
            }
          : item
      )
    );
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
            Чеки
          </button>
        </div>
      ),
    },
    {
      key: "payment_status",
      title: "Оплата",
      width: "150px",
      isButton: true,
      render: (value: string, row: FinanceTableItem) => (
        <button
          onClick={() => handleStatusChange(row.id)}
          className={classNames(styles.statusBadge, {
            [styles.paid]: value === "Оплачено",
            [styles.unpaid]: value === "Не оплачено",
          })}
        >
          {value}
        </button>
      ),
    },
  ];

  const checksColumns = [
    {
      key: "group_name",
      title: "Группа",
      width: "150px",
      render: () => groupDetails?.name || "Загрузка...",
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
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className={styles.selectField}>
                <SelectField
                  options={statusOptions}
                  isShadow
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  placeholder="Статус оплаты"
                />
              </div>
            </div>
          </div>

          <div className={styles.tableContainer}>
            {loading ? (
              <TableSkeleton />
            ) : (
              <Table
                columns={financeColumns}
                data={filteredFinance}
                emptyMessage="Данные о финансах не найдены"
              />
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
