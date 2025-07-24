"use client";
import Footer from "@components/Footer";
import Header from "@components/Header";
import ProfileHeroBanner from "@components/ProfileHeroBanner";
import StudentTabBar from "@components/StudentTabBar";
import { ModalProvider } from "@context/ModalContext";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "src/store/store";
import { getGroup, getUser } from "src/store/user/user.action";

export default function StudentProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const { groups, user } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(getGroup());
    dispatch(getUser());
  }, [dispatch]);

  useEffect(() => {
    if (groups) {
      localStorage.setItem(
        "groups",
        JSON.stringify(groups.map((item) => item.id))
      );
    }
    if (user?.role) {
      localStorage.setItem("role", user.role);
    }
  }, [groups, user]);

  useEffect(() => {
    localStorage.setItem(
      "evrika-access-token",
      // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0IiwiYXVkIjpbImZhc3RhcGktdXNlcnM6YXV0aCJdLCJleHAiOjE3NTUzNDQ1NzB9.gla_5czweUhBXBLL5OHArEf54d1ms9IZzAGUZS9VY6A"
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiYXVkIjpbImZhc3RhcGktdXNlcnM6YXV0aCJdLCJleHAiOjE3NTU4OTU2NzN9.D-ND4Ygj9uTz8pzoKQ9ctxI9UicyZMnHvLUA6rXBQlc"
    );
  }, []);

  return (
    <ModalProvider>
      <div>
        <Header />
        {user ? (
          <ProfileHeroBanner
            name={user.first_name + " " + user.last_name}
            role={user.role}
          />
        ) : (
          <ProfileHeroBanner name="" />
        )}
        {user?.role === "admin" || user?.role === "teacher" ? (
          <StudentTabBar role={"teacher"} />
        ) : (
          <StudentTabBar role={"student"} />
        )}
        {children}
        <Footer />
      </div>
    </ModalProvider>
  );
}
