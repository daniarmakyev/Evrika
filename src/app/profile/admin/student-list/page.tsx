"use client";

import styles from "./styles.module.scss";
import { useState, useEffect } from "react";
import TableSkeleton from "@components/TableSkeleton/TableSkeleton";
import Pagination from "@components/Pagination";
import Table from "@components/Table";
import { Ellipsis } from "lucide-react";
import classNames from "classnames";
import DropdownMenu from "@components/Ui/DropdownMenu/DropdownMenu";
import InputField from "@components/Fields/InputField";
import { Search } from "lucide-react";
import SelectField from "@components/Fields/SelectField";
import { Download } from "lucide-react";
import AddStudent from "./components/add-student";
import {
  useGetStudentListQuery,
  useDeleteStudentMutation,
} from "src/store/admin/students/students";
import { useExportStudentsMutation } from "src/store/admin/export/export";
import { useAppSelector, useAppDispatch } from "src/store/store";
import {
  getCourses,
  getGroups,
} from "src/store/courseGroup/courseGroup.action";
import type { Student } from "src/consts/types";
import { useRouter } from "next/navigation";

export default function StudentList() {
  const [openRowId, setOpenRowId] = useState<number | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const { courses, groups } = useAppSelector((state) => state.groupsCourses);
  const [showExport, setShowExport] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const size = 20;

  useEffect(() => {
    dispatch(getCourses());
    dispatch(getGroups({ limit: 99, offset: 0 }));
  }, [dispatch]);

  const user_id = selectedGroup ? Number(selectedGroup) : null;

  const { data, error, isLoading, refetch } = useGetStudentListQuery(
    {
      page: currentPage,
      size,
      user_id: user_id,
    },
    {
      skip: !user_id,
    }
  );

  const filteredStudents = data?.students?.filter((student: Student) =>
    student.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [deleteStudent] = useDeleteStudentMutation();

  const [exportStudents] = useExportStudentsMutation();

  const handleOptionClick = async (option: string, student: Student) => {
    switch (option) {
      case "Редактировать":
        console.log("Edit student:", student);
        setSelectedStudent(student);
        setIsAddModalOpen(true);
        break;

      case "Удалить":
        console.log("Delete student:", student.id);
        if (
          window.confirm(
            `Вы уверены, что хотите удалить студента: ${student.full_name}?`
          )
        ) {
          try {
            await deleteStudent(student.id).unwrap();
            alert(`Студент ${student.full_name} успешно удалён`);
          } catch (err: unknown) {
            if (err instanceof Error) {
              alert(`Ошибка при удалении: ${err.message}`);
            } else {
              alert(`Ошибка при удалении: ${JSON.stringify(err)}`);
            }
          }
        }
        break;

      case "Посмотреть":
        router.push(`/profile/admin/student-list/${student.id}`);
        break;

      default:
        break;
    }
    setOpenRowId(null);
  };

  const handleExport = async (format: "csv" | "xlsx") => {
    try {
      if (!exportStudents) return;

      const blob = await exportStudents({ group_id: user_id, format }).unwrap();

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `students.${format}`;
      link.click();
    } catch (err) {
      console.error("Ошибка при экспорте:", err);
      alert("Не удалось скачать файл");
    }
    setShowExport(false);
  };

  const homeWorkColumns = [
    {
      key: "full_name",
      title: "ФИО",
      width: "230px",
      render: (value: string, row: Student) => {
        const isMenuOpen = openRowId === row.id;
        return (
          <div className={styles.noUnderline}>
            <button
              className={styles.table__button}
              onClick={() => setOpenRowId(isMenuOpen ? null : row.id)}
            >
              <Ellipsis style={{ cursor: "pointer" }} />
              {isMenuOpen && (
                <DropdownMenu
                  options={["Редактировать", "Удалить", "Посмотреть"]}
                  onSelect={(option) => handleOptionClick(option, row)}
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
      key: "groups",
      title: "Группа",
      width: "220px",
      isButton: false,
      render: (value: { id: number; name: string }[] = []) => {
        if (!value || value.length === 0) return <span>-</span>;

        const joined = value.map((g) => g.name).join(", ");

        return (
          <span
            style={{
              display: "inline-block",
              maxWidth: "220px",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              verticalAlign: "middle",
            }}
            title={joined}
          >
            {joined}
          </span>
        );
      },
    },
    {
      key: "email",
      title: "Почта",
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
      key: "phone_number",
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
      key: "is_active",
      title: "Статус",
      width: "50px",
      render: (value: boolean) => {
        return (
          <div
            className={classNames(styles.status, {
              [styles.active]: value,
              [styles.inactive]: !value,
            })}
          >
            {value ? "Активен" : "Не активен"}
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    if (courses?.length && groups?.length) {
      if (!selectedCourse || !selectedGroup) {
        const defaultCourse = courses[0];
        setSelectedCourse(String(defaultCourse.id));

        const firstGroup = groups.find(
          (group) => group.course_id === defaultCourse.id
        );

        if (firstGroup) {
          setSelectedGroup(String(firstGroup.id));
        }
      }
    }
  }, [courses, groups, selectedCourse, selectedGroup]);

  const groupOptions =
    groups
      ?.filter((group) =>
        selectedCourse ? group.course_id === Number(selectedCourse) : true
      )
      .map((group) => ({
        value: String(group.id),
        label: group.name,
      })) ?? [];

  const courseOptions =
    courses?.map((item) => ({
      value: String(item.id),
      label: item.name,
    })) ?? [];

  const handleCourseChange = (courseId: string | null) => {
    setSelectedCourse(courseId);

    if (courseId) {
      const firstGroup = groups?.find(
        (group) => group.course_id === Number(courseId)
      );
      setSelectedGroup(firstGroup ? String(firstGroup.id) : null);
    } else {
      setSelectedGroup(null);
    }

    setCurrentPage(1);
  };

  const handleGroupChange = (groupId: string | null) => {
    setSelectedGroup(groupId);
    setCurrentPage(1);
  };

  return (
    <div className={classNames(styles.homework__container, "container")}>
      <div className={styles.button_container}>
        <button
          className={styles.add__button}
          onClick={() => setIsAddModalOpen(true)}
        >
          Добавить
        </button>
      </div>

      {error ? (
        <div className={styles.errorMessage}>
          <p>Произошла ошибка при загрузке студентов.</p>
          <pre>{JSON.stringify(error, null, 2)}</pre>
          <button onClick={() => refetch()} className={styles.retryButton}>
            Повторить попытку
          </button>
        </div>
      ) : isLoading ? (
        <TableSkeleton />
      ) : (
        <div className={styles.homework__content}>
          <div className={styles.homework__title}>
            <h3>Студенты</h3>

            <div>
              <InputField
                isShadow
                leftIcon={<Search />}
                placeholder="Поиск по имени"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div style={{ position: "relative" }}>
              <button
                className={styles.white__button}
                onClick={() => setShowExport((prev) => !prev)}
              >
                <Download /> Выгрузить
              </button>
              {showExport && (
                <div className={styles.export_content}>
                  <button onClick={() => handleExport("csv")}> CSV</button>
                  <button onClick={() => handleExport("xlsx")}> XLSX</button>
                </div>
              )}
            </div>

            <div style={{ width: "210px", position: "relative" }}>
              <SelectField
                isShadow
                value={selectedCourse ?? ""}
                onChange={(e) => handleCourseChange(e.target.value || null)}
                options={courseOptions}
                placeholder="Выбрать курс"
              />
            </div>
            <div style={{ width: "210px", position: "relative" }}>
              <SelectField
                isShadow
                value={selectedGroup ?? ""}
                onChange={(e) => handleGroupChange(e.target.value || null)}
                options={groupOptions}
                placeholder="Выбрать группу"
              />
            </div>
          </div>

          <div className={styles.homework__table}>
            <Table
              columns={homeWorkColumns}
              data={filteredStudents}
              emptyMessage={
                !selectedGroup
                  ? "Выберите группу для просмотра студентов"
                  : "Нет данных"
              }
            />
          </div>

          {data?.pagination && data.pagination.total_pages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={data?.pagination.total_pages}
              handlePageChange={setCurrentPage}
            />
          )}
        </div>
      )}

      <AddStudent
        isOpen={isAddModalOpen}
        onClose={() => {
          setSelectedStudent(null);
          setIsAddModalOpen(false);
        }}
        student={selectedStudent}
      />
    </div>
  );
}
