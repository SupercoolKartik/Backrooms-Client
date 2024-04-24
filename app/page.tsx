"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Main = () => {
  const router = useRouter();

  //Redirects user to the Entrance page of this app
  useEffect(() => {
    localStorage.getItem("name")
      ? router.push("/rooms", { scroll: false })
      : router.push(`/entrance`, { scroll: false });
  }, [router]); // Include router in dependencies array

  return null;
};

export default Main;
