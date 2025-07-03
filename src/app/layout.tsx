import type { Metadata } from "next";
import localFont from 'next/font/local';
import AsideButton from "@components/AsideButton";
import "../styles/global.scss";
import { ModalProvider } from "@context/ModalContext";
import LessonModal from "@components/LessonModal";

const nunitoSans = localFont({
  src: [
    {
      path: '../../public/assets/fonts/Nunito_Sans/NunitoSans-VariableFont_YTLC,opsz,wdth,wght.ttf',
      weight: '100 1000',
      style: 'normal',
    },
    {
      path: '../../public/assets/fonts/Nunito_Sans/NunitoSans-Italic-VariableFont_YTLC,opsz,wdth,wght.ttf',
      weight: '100 1000',
      style: 'italic',
    },
  ],
  variable: '--font-nunito-sans',
});

export const metadata: Metadata = {
  title: "Эврика",
  description: "Иностранная школа с уклоном на обучение различных языков мира.",
  icons: {
    icon: "/favicon.ico",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={nunitoSans.variable}>
      <body>
        <ModalProvider>
          {children}
          <AsideButton />
          <LessonModal />
        </ModalProvider>
      </body>
    </html>
  );
}
