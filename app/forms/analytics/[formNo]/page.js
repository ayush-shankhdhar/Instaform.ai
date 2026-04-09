"use client";
import React, { useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Analytic from "@/components/Analytic";
import Splash from "@/components/Splash";
import { useGlobalContext } from "@/context/GlobalContext";

const Analytics = () => {
  const { loading, setFadeOut, setLoading } = useGlobalContext();

  useEffect(() => {
    const cookieToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (!cookieToken) {
      window.location.href = "/login";
      return;
    }

    setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setLoading(false), 500);
    }, 1500);
  }, []);

  return (
    <>
      {loading ? (
        <Splash />
      ) : (
        <>
          <Sidebar tabSelected={1} />
          <Analytic />
        </>
      )}
    </>
  );
};

export default Analytics;