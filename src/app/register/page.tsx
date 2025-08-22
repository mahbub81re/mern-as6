"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  async function handleRegister(e: React.FormEvent) {
    console.log(email,password);
    e.preventDefault();
    await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({name, email, password }),
    });
    await signIn("credentials", { email, password, redirect: true, callbackUrl: "/" });
  }

  return (
    <form onSubmit={handleRegister} className="max-w-sm mx-auto space-y-3">
      <input type="name" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} className="w-full border px-2 py-1"/>
      <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full border px-2 py-1"/>
      <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full border px-2 py-1"/>
      <button type="submit" className="w-full bg-green-600 text-white py-2">Register</button>
    </form>
  );
}
