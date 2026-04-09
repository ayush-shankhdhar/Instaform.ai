"use client";
import axios from "axios";
import { createContext, useState, useContext, useEffect } from "react";

const GlobalContext = createContext();

async function handleUser(token) {
  const response = await axios.post(`/api/user`, { token });
  return response.data;
}

export const GlobalProvider = ({ children }) => {
  const [formData, setFormData] = useState([]);
  const [theme, setTheme] = useState("");
  const [token, setToken] = useState(null);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (typeof document !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (!savedTheme) {
        localStorage.setItem("theme", "dark");
      }
      setTheme(savedTheme || "dark");
      const cookieToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];
      setToken(cookieToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      handleUser(token)
        .then((data) => {
          if (data && !data.error) {
            setUser(data);
          }
        })
        .catch((err) => console.error("Failed to fetch user:", err));
    }
  }, [token]);

  return (
    <GlobalContext.Provider
      value={{
        token, setToken,
        fadeOut, setFadeOut,
        loading, setLoading,
        user, setUser,
        theme, setTheme,
        formData, setFormData,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
