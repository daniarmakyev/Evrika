"use client";

import styles from "./styles.module.scss";
import { useState, useEffect } from "react";
import TableSkeleton from "@components/TableSkeleton/TableSkeleton";

import Table from "@components/Table";

import classNames from "classnames";

import InputField from "@components/Fields/InputField";
import { Search } from "lucide-react";
import SelectField from "@components/Fields/SelectField";

import { useGetStudentListQuery } from "src/store/admin/students/students";

import { useAppSelector, useAppDispatch } from "src/store/store";
import {
  getCourses,
  getGroups,
} from "src/store/courseGroup/courseGroup.action";
import type { Student } from "src/consts/types";

export default function StudentList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const { courses, groups } = useAppSelector((state) => state.groupsCourses);

  const dispatch = useAppDispatch();
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

  console.log(data?.students, "Student", error);

  const filteredStudents = data?.students?.filter((student: Student) =>
    student.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const homeWorkColumns = [
    {
      key: "full_name",
      title: "ФИО",
      width: "230px",
      render: (value: string) => {
        return (
          <div className={styles.noUnderline} style={{ position: "relative" }}>
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
      width: "100px",
      render: (value: boolean) => {
        return <div>{value ? "Активен" : "Не активен"}</div>;
      },
    },
  ];

  useEffect(() => {
  if (courses?.length && groups?.length) {
    if (!selectedCourse || !selectedGroup) {
      // Find the first course that has archived groups
      const firstArchivedCourse = courses.find((course) =>
        groups.some((group) => group.course_id === course.id && group.is_archived)
      );

      if (firstArchivedCourse) {
        setSelectedCourse(String(firstArchivedCourse.id));

        const firstArchivedGroup = groups.find(
          (group) =>
            group.course_id === firstArchivedCourse.id && group.is_archived
        );

        if (firstArchivedGroup) {
          setSelectedGroup(String(firstArchivedGroup.id));
        }
      }
    }
  }
}, [courses, groups, selectedCourse, selectedGroup]);

const archivedCourseIds =
  groups
    ?.filter((group) => group.is_archived)
    .map((group) => group.course_id) ?? [];

const courseOptions =
  courses
    ?.filter((course) => archivedCourseIds.includes(course.id))
    .map((item) => ({
      value: String(item.id),
      label: item.name,
    })) ?? [];

const groupOptions =
  groups
    ?.filter(
      (group) =>
        group.is_archived &&
        (selectedCourse ? group.course_id === Number(selectedCourse) : true)
    )
    .map((group) => ({
      value: String(group.id),
      label: group.name,
    })) ?? [];

const handleCourseChange = (courseId: string | null) => {
  setSelectedCourse(courseId);

  if (courseId) {
    const firstArchivedGroup = groups?.find(
      (group) =>
        group.course_id === Number(courseId) && group.is_archived
    );
    setSelectedGroup(firstArchivedGroup ? String(firstArchivedGroup.id) : null);
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
            <h3>Список архивированных студентов</h3>

            <div>
              <InputField
                isShadow
                leftIcon={<Search />}
                placeholder="Поиск по имени"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
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
          </div>

          <div className={styles.homework__table}>
            <Table
              columns={homeWorkColumns}
              data={filteredStudents}
              emptyMessage= "Нет данных"
              
            />
          </div>
        </div>
      )}
    </div>
  );
}
