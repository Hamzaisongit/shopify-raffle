"use client";

import AuthButton from "@/components/AuthButton";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold">Hey there, Welcome to Raffle-Pro!!</h1>
      <AuthButton />
    </main>
  );
}

