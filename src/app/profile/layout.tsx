"use client";
import Footer from "@components/Footer";
import Header from "@components/Header";
import ProfileHeroBanner from "@components/ProfileHeroBanner";
import StudentTabBar from "@components/StudentTabBar";
import { ModalProvider } from "@context/ModalContext";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "src/store/store";
import { getGroup, getStudent } from "src/store/users/student/student.action";

export default function StudentProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const { groups, student } = useAppSelector((state) => state.student);

  useEffect(() => {
    dispatch(getGroup());
    dispatch(getStudent());
  }, [dispatch]);

  useEffect(() => {
    if (groups) {
      localStorage.setItem(
        "groups",
        JSON.stringify(groups.map((item) => item.id))
      );
    }
  }, [groups]);

  useEffect(() => {
    const token = localStorage.getItem("evrika-access-token");

    if (!token) {
      localStorage.setItem(
        "evrika-access-token",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0IiwiYXVkIjpbImZhc3RhcGktdXNlcnM6YXV0aCJdLCJleHAiOjE3NTUzNDQ1NzB9.gla_5czweUhBXBLL5OHArEf54d1ms9IZzAGUZS9VY6A"
      );
    }
  }, []);

  return (
    <ModalProvider>
      <div>
        <Header />
        {student ? (
          <ProfileHeroBanner
            name={student.first_name + " " + student.last_name}
          />
        ) : (
          <ProfileHeroBanner name="Ошибка Сервера" />
        )}
        <StudentTabBar />
        {children}
        <Footer />
      </div>
    </ModalProvider>
  );
}
