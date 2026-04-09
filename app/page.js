"use client";
import { useEffect } from "react";
import Create from "@/components/Create";
import Sidebar from "@/components/Sidebar";
import { useGlobalContext } from "@/context/GlobalContext";
import Splash from "@/components/Splash";

const Page = () => {
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
          <Sidebar tabSelected={0} />
          <Create />
        </>
      )}
    </>
  );
};

export default Page;
