import type { Metadata } from "next";
import localFont from 'next/font/local';
import AsideButton from "@components/AsideButton";
import "../styles/global.scss";

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
  title: "Reviro",
  description: "Reviro - your task management solution",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={nunitoSans.variable}>
      <body>
        {children}
        <AsideButton />
      </body>
    </html>
  );
}
