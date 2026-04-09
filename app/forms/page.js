"use client";
import Sidebar from "@/components/Sidebar";
import Splash from "@/components/Splash";
import { useEffect } from "react";
import { useGlobalContext } from "@/context/GlobalContext";
import Forms from "@/components/Forms";

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
          <Sidebar tabSelected={1} />
          <Forms />
        </>
      )}
    </>
  );
};

export default Page;
