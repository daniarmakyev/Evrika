"use client";
import Header from "@components/Header";
import ProfileHeroBanner from "@components/ProfileHeroBanner";
import StudentTabBar from "@components/StudentTabBar";
import { ModalProvider } from "@context/ModalContext";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "src/store/store";
import { getGroup } from "src/store/users/student/student.action";

export default function StudentProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const { groups } = useAppSelector((state) => state.student);

  useEffect(() => {
    dispatch(getGroup());
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
        <ProfileHeroBanner name="Пупкин Иванов" />
        <StudentTabBar />
        {children}
      </div>
    </ModalProvider>
  );
}
