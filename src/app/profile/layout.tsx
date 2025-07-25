"use client";

import Footer from "@components/Footer";
import Header from "@components/Header";
import ProfileHeroBanner from "@components/ProfileHeroBanner";
import StudentTabBar from "@components/StudentTabBar";
import { ModalProvider } from "@context/ModalContext";
import { useParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "src/store/store";
import { getGroup, getUser } from "src/store/user/user.action";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const { groups, user } = useAppSelector((state) => state.user);
  const params = useParams();

  const studentId = useMemo(() => {
    if (params) {
      const id = params.id ? params.id[0] : null;
      return id;
    }
    return null;
  }, [params]);

  useEffect(() => {
    if(params){
      dispatch(getUser());
    }
  }, [params,dispatch]);

  const isProfileStudent = !!studentId;

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  useEffect(() => {
    if (user?.role) {
      dispatch(getGroup(user.role));
      localStorage.setItem("role", user.role);
    }
  }, [user, dispatch]);

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
        {user ? (
          <>
            <ProfileHeroBanner
              name={`${user.first_name} ${user.last_name}`}
              role={user.role}
              // isStudentProfile={false}
            />
            <StudentTabBar
              role={user.role}
              studentId={studentId}
              isProfileStudent={isProfileStudent}
            />
          </>
        ) : (
          <ProfileHeroBanner name="" />
        )}
        {children}
        <Footer />
      </div>
    </ModalProvider>
  );
}
