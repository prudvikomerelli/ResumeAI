"use client";

import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#fff",
          color: "#363636",
          borderRadius: "0.75rem",
          border: "1px solid #e5e7eb",
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
        },
      }}
    />
  );
}
