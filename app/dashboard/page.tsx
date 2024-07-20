"use client";
import React, { useEffect, useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/ModeToggle";
import Logout from "@/components/Logout";
import { getUserData } from "@/actions/auth";
import { logout } from "@/actions/auth";

export default function Page() {
  const [session, setSession] = useState<any>();

  useEffect(() => {
    async function fetchData() {
      const data = await getUserData();
      console.log(data);
      setSession(data);
    }
    fetchData();
  }, []);

  const [view, setView] = useState<string>("Dashboard");
  const links = [
    {
      label: "Dashboard",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Profile",
      icon: (
        <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Settings",
      icon: (
        <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 max-w- mx- border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <div key={idx} onClick={() => setView(link.label)}>
                  <SidebarLink key={idx} link={link} />
                </div>
              ))}
              <div
                className={cn(
                  "flex items-center justify-start gap-2 group/sidebar py-2 cursor-pointer"
                )}
                onClick={() => logout()}
              >
                <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                <motion.span
                  animate={{
                    display: open ? "inline-block" : "none",
                    opacity: open ? 1 : 0,
                  }}
                  className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
                >
                  Logout
                </motion.span>
              </div>
            </div>
          </div>
          <div>
            <ModeToggle />
            <div onClick={() => setView("Profile")}>
              <SidebarLink
                link={{
                  label: session?.user?.name || "Add your name",
                  icon: (
                    <Image
                      src={session?.user?.image || "/avatar.png"}
                      alt="Avatar"
                      width={50}
                      height={50}
                      className="h-7 w-7 flex-shrink-0 rounded-full"
                    />
                  ),
                }}
              />
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex flex-1">
        <div className="p-2 md:p-10 rounded-t-2xl sm:rounded-l-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
          {view == "Dashboard" && Dashboard()}
          {view == "Settings" && Settings()}
          {view == "Profile" && Profile()}
        </div>
      </div>
    </div>
  );
}
export const Logo = () => {
  return (
    <Link
      href="/"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        UnStudio
      </motion.span>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      href="/"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};

const Dashboard = () => {
  return <div>Dashboard</div>;
};

const Settings = () => {
  return <div>Settiu</div>;
};

const Profile = () => {
  return <div>Profile</div>;
};
