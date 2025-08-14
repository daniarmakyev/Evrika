"use client";
import styles from "./styles.module.scss";
import { useState } from "react";
// import TableSkeleton from "@components/TableSkeleton/TableSkeleton";
import Table from "@components/Table";
import { Ellipsis } from "lucide-react";
import classNames from "classnames";
import DropdownMenu from "@components/Ui/DropdownMenu/DropdownMenu";
import InputField from "@components/Fields/InputField";
import { Search } from "lucide-react";
import SelectField from "@components/Fields/SelectField";
import { Download } from "lucide-react";
import AddStudent from "./components/add-student";
type TableDataItem = {
  id: number;
  name: string;
  group: string;
  course?: string;
  email: string;
  phone: string;
  status: "active" | "non-active"; // restrict to possible values
};

export default function StudentList() {
  const [openRowId, setOpenRowId] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleOptionClick = () => {
    setOpenRowId(null); // close menu after selection
  };
  const homeWorkColumns = [
    {
      key: "name",
      title: "ФИО",
      width: "230px",
      isButton: true,
      render: (value: string, row: TableDataItem) => {
        const isMenuOpen = openRowId === row.id;
        return (
          <div className={styles.noUnderline} style={{ position: "relative" }}>
            <button
              className={styles.table__button}
              onClick={() => setOpenRowId(isMenuOpen ? null : row.id)}
            >
              {/* <div style={{position:'relative'}}> */}
              <Ellipsis />
              {/* </div> */}
              {isMenuOpen && (
                <DropdownMenu
                  options={["Редактировать", "Удалить", "Посмотреть"]}
                  onSelect={handleOptionClick}
                />
              )}
            </button>
            <span
              style={{
                color: "black",
                textDecoration: "none",
              }}
            >
              {value.length > 50 ? value.substring(0, 50) + "..." : value}
            </span>
          </div>
        );
      },
    },
    {
      key: "group",
      title: "Группа",
      width: "220px",
      isButton: false,
      render: (value: string) => {
        return (
          <span>
            {value.length > 50 ? value.substring(0, 50) + "..." : value}
          </span>
        );
      },
    },
    {
      key: "email",
      title: "Почта",
      width: "220px",
      isButton: true,
      render: (value: string) => {
        return (
          <button
            // onClick={() => handleOpenTaskModal(row)}
            className={styles.table__button}
          >
            <span>
              {value.length > 50 ? value.substring(0, 50) + "..." : value}
            </span>
          </button>
        );
      },
    },
    {
      key: "phone",
      title: "Телефон",
      width: "220px",
      render: (value: string) => {
        return (
          <span>
            {value.length > 50 ? value.substring(0, 50) + "..." : value}
          </span>
        );
      },
    },
    {
      key: "status",
      title: "Статус",
      width: "100px",
      render: (value: string) => {
        return (
          <div
            style={{
              backgroundColor: value === "active" ? "green" : "red",
              color: "white",
              fontWeight: 600,
              borderRadius: "6px",
              fontSize: "13px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "30px",
            }}
          >
            {value === "active" ? "Активен" : "Не активен"}
          </div>
        );
      },
    },
  ];

  const tableData = [
    {
      id: 1,
      name: "Айкокул Чаргынова",
      group: "Английский A1-0925",
      course: "Английский A1",
      email: "email@gmail.com",
      phone: "+99670770707",
      status: "active",
    },
    {
      id: 2,
      name: "Айкокул Чаргынова",
      group: "Английский A1-0925",
      email: "email@gmail.com",
      phone: "+99670770707",
      status: "active",
      course: "Английский A1",
    },
    {
      id: 3,
      name: "Айкокул Чаргынова",
      group: "Английский A1-0925",
      email: "email@gmail.com",
      phone: "+99670770707",
      status: "non-active",
      course: "Английский A1",
    },
  ];

  const groupOptions = [
    { value: "", label: "Все группы" }, // default "All"
    ...Array.from(new Set(tableData.map((item) => item.group))).map(
      (groupName) => ({
        value: groupName,
        label: groupName,
      })
    ),
  ];
  const courseOptions = [
    { value: "", label: "Все курсы" }, // default "All"
    ...Array.from(new Set(tableData.map((item) => item.course))).map(
      (groupName) => ({
        value: groupName,
        label: groupName,
      })
    ),
  ];

  return (
    <div className={classNames(styles.homework__container, "container")}>
      <div className={styles.button_container}>
        <button
          className={styles.add__button}
          onClick={() => setIsAddModalOpen(true)}
        >
          Добавить
        </button>
        <button className={styles.white__button}>Архив</button>
      </div>
      <div className={styles.homework__content}>
        <div className={styles.homework__title}>
          <h3>Студенты</h3>
          {/* <div style={{ width: "210px", position: "relative" }}>
              <SelectField
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                options={groupOptions}
              />
            </div> */}
          <div>
            <InputField leftIcon={<Search />} placeholder="Поиск по имени" />
          </div>
          <div>
            <button className={styles.white__button}>
              <Download /> Выгрузить
            </button>
          </div>
          <div className={styles.filter_container}>
            <div style={{ width: "210px", position: "relative" }}>
              <SelectField
                // value={selectedGroup}
                // onChange={(e) => setSelectedGroup(e.target.value)}
                options={courseOptions}
              />
            </div>
            <div style={{ width: "210px", position: "relative" }}>
              <SelectField
                // value={selectedGroup}
                // onChange={(e) => setSelectedGroup(e.target.value)}
                options={groupOptions}
              />
            </div>
          </div>
        </div>

        <div className={styles.homework__table}>
          <Table
            columns={homeWorkColumns}
            data={tableData}
            emptyMessage="Нет данных о посещаемости"
          />
        </div>

        {/* {data?.pagination && data.pagination.total_pages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={data?.pagination.total_pages}
            handlePageChange={setCurrentPage}
          />
        )} */}
      </div>
        <AddStudent 
      isOpen={isAddModalOpen} 
      onClose={() => setIsAddModalOpen(false)} 
    />
    </div>
  );
}
