import Header from "@components/Header";
import ProfileHeroBanner from "@components/ProfileHeroBanner";
import StudentTabBar from "@components/StudentTabBar";

export default function StudentProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      <ProfileHeroBanner name="Пупкин Иванов"/>
      <StudentTabBar />
      {children}
    </div>
  );
}
