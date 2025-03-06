"use client";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
const [storeName, setStoreName] = useState("")

const shop = useSearchParams().get('shop')
  const router = useRouter();

  async function handleSignup(e) {
    e.preventDefault();
    
    const verifiedOwner = await verifyEmailIdentity(email)

    if(!verifiedOwner){
      alert('email verification failed')
      return {status:'falied',msg:"Please ensure you signup with the same email as your shopify store"}
    }

    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else {
      alert("Signup successful! Please check your email.");

      router.push("/login");
    }
  }

  async function verifyEmailIdentity(enteredEmail){
    const {data, error} = await supabase.from('store').select('*').eq('store_domain',shop).single()

    if(error){
      console.log('error while verifying email',error)
      return false
    }
    if(data.email == enteredEmail){
      return true
    }
    return false
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
          placeholder="store name"
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
