"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import LoginForm from "@/components/LoginForm";

const Login = () => {
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

  return <LoginForm />;
};

export default Login;