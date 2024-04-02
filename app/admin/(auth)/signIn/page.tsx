"use client";

import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React from "react";

const Page = () => {
  const { data: session } = useSession();
  if (session && session.user) {
    redirect("/admin");
  }

  return (
    <main className="flex flex-col items-center w-full h-screen justify-center bg-slate-100 py-10">
      <Button onClick={() => signIn("google")}>Sign in with Google</Button>
    </main>
  );
};

export default Page;
