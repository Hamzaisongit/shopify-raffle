"use client";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserProvider";
import { Loader2Icon } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
const {user,loading} = useUser()

  async function handleLogin(e) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else {
      alert("Login successful!");
      router.push("/dashboard");
    }
  }

  useEffect(()=>{
    if(loading)return;
    if(user){
      router.push('/raffle-dashboard')
    }
  },[loading, user, router])

  return (loading ? <Loader2Icon></Loader2Icon> :
    <div className="flex flex-col items-center justify-center min-h-screen">
    <h2 className="text-2xl font-bold">Login</h2>
    <form onSubmit={handleLogin} className="flex flex-col gap-3">
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
      <button type="submit" className="bg-green-500 text-white p-2">Login</button>
    </form>
  </div>
  );
}
