"use client";
import { QRProvider } from "@/components/QRpage/QRProvider";

export default function QRLayout({ children }) {
  return (
    <QRProvider>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl">{children}</div>
      </div>
    </QRProvider>
  );
}
