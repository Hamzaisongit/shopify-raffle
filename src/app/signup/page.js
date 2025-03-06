"use client";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup({ searchParams }) {  // ✅ Accept searchParams as a prop
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [storeName, setStoreName] = useState("");
  const router = useRouter();

  const shop = searchParams?.shop || "";  // ✅ Get shop from searchParams

  async function handleSignup(e) {
    e.preventDefault();
    
    const verifiedOwner = await verifyEmailIdentity(email);
    if (!verifiedOwner) {
      alert("Email verification failed");
      return { status: "failed", msg: "Please ensure you signup with the same email as your Shopify store" };
    }

    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else {
      alert("Signup successful! Please check your email.");
      router.push("/login");
    }
  }

  async function verifyEmailIdentity(enteredEmail) {
    const { data, error } = await supabase.from("store").select("*").eq("store_domain", shop).single();

    if (error) {
      console.log("Error while verifying email:", error);
      return false;
    }
    return data.email === enteredEmail;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold">Sign Up</h2>
      <form onSubmit={handleSignup} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="Email"
          className="border p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Store name"
          className="border p-2"
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2">Sign Up</button>
      </form>
    </div>
  );
}
