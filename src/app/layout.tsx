import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/toast-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ResumeAI — ATS-Optimized Resume & Cover Letter Generator",
  description:
    "Transform your resume into an ATS-optimized, job-specific resume and tailored cover letter. Get keyword gap analysis and ATS match scoring.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider />
        {children}
      </body>
    </html>
  );
}
