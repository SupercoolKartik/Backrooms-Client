"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const main = () => {
  const router = useRouter();

  //Redirects user to the Entrance page of this app
  useEffect(() => {
    router.push("/entrance");
  }, [router]); // Include router in dependencies array

  return null;
};

export default main;
