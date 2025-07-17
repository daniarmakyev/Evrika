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

  return (
    <ModalProvider>
      <div>
        <Header />
        {student ? (
          <ProfileHeroBanner
            name={student.first_name + " " + student.last_name}
          />
        ) : (
          <ProfileHeroBanner name="Пупкин Иванов" />
        )}
        <StudentTabBar />
        {children}
        <Footer />
      </div>
    </ModalProvider>
  );
}
