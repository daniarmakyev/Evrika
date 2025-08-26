"use client";
import styles from "./styles.module.scss";
import { useState, useEffect } from "react";
import TableSkeleton from "@components/TableSkeleton/TableSkeleton";
import Table from "@components/Table";
import Pagination from "@components/Pagination";
import { Ellipsis } from "lucide-react";
import classNames from "classnames";
import DropdownMenu from "@components/Ui/DropdownMenu/DropdownMenu";
import InputField from "@components/Fields/InputField";
import { Search } from "lucide-react";
import SelectField from "@components/Fields/SelectField";
import { Download } from "lucide-react";
import AddTeacher from "./__components/AddTeacher";
import {
  useGetTeacherListQuery,
  useDeleteTeacherMutation,
} from "src/store/admin/teachers/teachers";
import { useAppSelector, useAppDispatch } from "src/store/store";
import { getCourses } from "src/store/courseGroup/courseGroup.action";
import type { AdminTeacher } from "src/consts/types";
import { useRouter } from "next/navigation";

export default function TeachersList() {
  const [openRowId, setOpenRowId] = useState<number | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<AdminTeacher | null>(
    null
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const size = 20;
  const { courses } = useAppSelector((state) => state.groupsCourses);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getCourses());
  }, [dispatch]);
  const course_id = selectedCourse ? Number(selectedCourse) : null;

  const { data, error, isLoading, refetch } = useGetTeacherListQuery(
    {
      page: currentPage,
      size,
      course_id: course_id,
    },
    {
      skip: !course_id,
    }
  );

  console.log(data, "TeacherData");

  const filteredTeachers = data?.teachers?.filter((teacher: AdminTeacher) =>
    teacher.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const [deleteTeacher] = useDeleteTeacherMutation();

  const handleOptionClick = async (option: string, teacher: AdminTeacher) => {
    switch (option) {
      case "Редактировать":
        console.log("Edit student:", teacher);
        setSelectedTeacher(teacher);
        setIsAddModalOpen(true);
        break;

      case "Удалить":
        console.log("Delete student:", teacher.id);
        if (
          window.confirm(
            `Вы уверены, что хотите удалить студента: ${teacher.full_name}?`
          )
        ) {
          try {
            await deleteTeacher(teacher.id).unwrap();
            alert(`Преподаватель ${teacher.full_name} успешно удалён`);
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
        router.push(`/profile/admin/teacher-list/${teacher.id}`);
        break;

      default:
        break;
    }
    setOpenRowId(null);
  };
  useEffect(() => {
    if (courses?.length) {
      if (!selectedCourse) {
        const defaultCourse = courses[0];
        setSelectedCourse(String(defaultCourse.id));
      }
    }
  }, [courses, selectedCourse]);

  const courseOptions =
    courses?.map((item) => ({
      value: String(item.id),
      label: item.name,
    })) ?? [];

  const handleCourseChange = (courseId: string | null) => {
    setSelectedCourse(courseId);
    setCurrentPage(1);
  };

  const homeWorkColumns = [
    {
      key: "full_name",
      title: "ФИО",
      width: "230px",
      render: (value: string, row: AdminTeacher) => {
        const isMenuOpen = openRowId === row.id;
        return (
          <div className={styles.noUnderline} style={{ position: "relative" }}>
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
      key: "courses",
      title: "Курсы",
      width: "220px",
      render: (value: { id: number; name: string }[] = []) => {
        if (!value || value.length === 0) return <span>-</span>;

        const joined = value.map((с) => с.name).join(", ");

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
      width: "100px",
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
            <h3>Преподаватели</h3>
            <div>
              <InputField
                isShadow
                leftIcon={<Search />}
                placeholder="Поиск по имени"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <button className={styles.white__button}>
                <Download /> Выгрузить
              </button>
            </div>
            <div className={styles.filter_container}>
              <div style={{ width: "210px", position: "relative" }}>
                <SelectField
                  isShadow
                  value={selectedCourse ?? ""}
                  onChange={(e) => handleCourseChange(e.target.value || null)}
                  options={courseOptions}
                  placeholder="Выбрать курс"
                />
              </div>
            </div>
          </div>

          <div className={styles.homework__table}>
            <Table
              columns={homeWorkColumns}
              data={filteredTeachers}
              emptyMessage="Данные о преподавателях отсутствуют"
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
      <AddTeacher
        isOpen={isAddModalOpen}
        onClose={() => {
          setSelectedTeacher(null);
          setIsAddModalOpen(false);
        }}
        teacher={selectedTeacher}
      />
    </div>
  );
}
