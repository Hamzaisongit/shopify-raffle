"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthButton() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    getUser();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return user ? (
    <button onClick={handleLogout} className="bg-red-500 text-white p-2">
      Logout
    </button>
  ) : (
    <div className="flex gap-2">
      <a href="/login" className="bg-blue-500 text-white p-2">Login</a>
      <a href="/signup" className="bg-green-500 text-white p-2">Sign Up</a>
    </div>
  );
}
