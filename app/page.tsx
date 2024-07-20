"use client";

import { motion } from "framer-motion";
import React from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import Link from "next/link";
import { getUserData } from "@/actions/auth";
import { useEffect, useState } from "react";

export default function Home() {
  const [session, setSession] = useState<any>();

  useEffect(() => {
    async function fetchData() {
      const data = await getUserData();
      console.log(data);
      setSession(data);
    }
    fetchData();
  }, []);
  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4"
      >
        <div className="text-3xl md:text-7xl font-bold dark:text-white text-center">
          Welcome to UnStudio
        </div>
        <div className="font-extralight text-base md:text-4xl dark:text-neutral-200 py-4">
          Draw and upload your images and make them come to life
        </div>
        {session?.user ? (
          <Link href="/dashboard">
            <button className="bg-black dark:bg-white rounded-full w-fit text-white dark:text-black px-4 py-2">
              Go to Dashboard →
            </button>
          </Link>
        ) : (
          <Link href="/sign-in">
            <button className="bg-black dark:bg-white rounded-full w-fit text-white dark:text-black px-4 py-2">
              Sign In
            </button>
          </Link>
        )}
      </motion.div>
    </AuroraBackground>
  );
}
