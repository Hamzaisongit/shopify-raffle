import { useState } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "./SideBar";
import { useSite } from "./SiteProvider";

export default function SiteHome() {
  const {sidebarOpen, setSidebarOpen} = useSite()

  return (
    <div className="h-screen flex flex-col">
    <Sidebar status={sidebarOpen}></Sidebar>
      <header className="w-full bg-gray-900 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Site Home</h1>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
          <Menu size={28} />
        </button>
      </header>

      <div className="flex flex-1">
           
        <main className="flex-1 p-6">
          <h2 className="text-2xl">Welcome to the Site</h2>
          <p className="mt-2 text-gray-600">Explore your options using the menu.</p>
        </main>
      </div>
    </div>
  );
}
