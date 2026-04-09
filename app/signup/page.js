"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import SignupForm from "@/components/SignupForm";

const Signup = () => {
  const router = useRouter();
  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
    if (token) {
      router.push("/");
    }
  }, []);

  return <SignupForm />;
};

export default Signup;