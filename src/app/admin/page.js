"use client";
import { useRouter } from "next/navigation";
import { QrCode, Users } from "lucide-react"; // Lucide icons for soft gray images
import { useAuth } from "@/components/auth/AuthProvider";

export default function AdminPage() {
  const router = useRouter();
  const {events} = useAuth()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-semibold text-gray-900 mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Generate QRs Card */}
        <div 
          className="bg-white shadow-md rounded-xl p-6 flex items-center justify-between w-72 cursor-pointer hover:shadow-lg transition"
          onClick={() => router.push("/admin/generate-qrs")}
        >
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-gray-200 rounded-lg">
              <QrCode size={40} className="text-gray-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Generate QRs</h2>
              <p className="text-gray-500 text-sm">Create & manage QR codes</p>
            </div>
          </div>
          <span className="text-gray-600 text-lg ml-2">➜</span>
        </div>

        {/* Manage Events Card */}
        <div 
          className="bg-white shadow-md rounded-xl p-6 flex items-center justify-between w-72 cursor-pointer hover:shadow-lg transition"
          onClick={() => router.push("/admin/manage-events")}
        >
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-gray-200 rounded-lg">
              <Users size={40} className="text-gray-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Manage Events</h2>
              <p className="text-gray-500 text-sm">Organize and track events</p>
            </div>
          </div>
          <span className="text-gray-600 text-lg ml-2">➜</span>
        </div>
      </div>
    </div>
  );
}
