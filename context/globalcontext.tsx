"use client";
import { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";
const AppContext = createContext<any>(undefined);

export const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [details, setDetails] = useState({ name: "", room: "" });
  const [socket, setSocket] = useState<any>("");
  function getTime() {
    const date = new Date();
    let hours = date.getHours(); // Get hours (24-hour format)
    const minutes = date.getMinutes().toString().padStart(2, "0"); // Get & pad minutes

    // Convert to 12-hour format and add am/pm
    const amPm = hours >= 12 ? "pm" : "am";
    hours = hours % 12 || 12; // Convert to 12-hour format (12 for midnight/noon)

    return `${hours}:${minutes} ${amPm}`;
  }
  const leavingRoom = () => {
    () => socket.disconnect();
    localStorage.removeItem("name");
    localStorage.removeItem("room");
    return router.push(`/entrance`, { scroll: false });
  };
  return (
    <AppContext.Provider
      value={{ details, setDetails, getTime, socket, setSocket, leavingRoom }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
