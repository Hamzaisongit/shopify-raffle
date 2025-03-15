"use client";
import { useEffect, useState } from "react";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6 pt-0">
      
        {children}

    </div>
  );
}
