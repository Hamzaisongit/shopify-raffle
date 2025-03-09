import { X } from "lucide-react";
import { useSite } from "./SiteProvider";

export default function Sidebar() {
  const { setSidebarOpen, sidebarOpen } = useSite();

  return (
    <div
      className={`fixed top-0 right-0 h-screen w-64 bg-blue-900 text-white p-5 flex flex-col transform transition-transform duration-300 ${
        sidebarOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <header className="flex flex-row justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Dashboard</h2>
        <button onClick={() => setSidebarOpen(false)} className="p-2">
          <X size={28} />
        </button>
      </header>
      <nav className="flex flex-col space-y-4">
        <a href="/generate-qrs" className="p-3 rounded-lg hover:bg-gray-800">
          Generate QRs
        </a>
        <a href="/manage-events" className="p-3 rounded-lg hover:bg-gray-800">
          Manage Events
        </a>
      </nav>
    </div>
  );
}
