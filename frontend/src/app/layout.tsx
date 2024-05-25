import { ReactNode } from "react";
import { Metadata } from "next";

import { Inter } from "next/font/google";

import "./default.scss";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "InSightGram",
  description: "AI tool that helps analyze instagram",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

