"use client";
import React, { useEffect, useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/ModeToggle";
import { getUserData } from "@/actions/auth";
import { logout } from "@/actions/auth";
import Draw from "@/components/Draw";
import { User } from "@prisma/client";
import VideoForm from "@/components/VideoForm";
import { VideoIcon } from "lucide-react";

export default function Page() {
  const [session, setSession] = useState<User | null>();

  useEffect(() => {
    async function fetchData() {
      const data: User | null = (await getUserData()) as User | null;
      setSession(data);
      console.log(data);
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
      label: "Generate video with rerender",
      icon: (
        <VideoIcon className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
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
                  label: session?.name || "Add your name",
                  icon: (
                    <Image
                      src={session?.image || "/avatar.png"}
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

const Dashboard = () => {
  return (
    <div className="felx justify-center items-center">
      <Draw />
    </div>
  );
};

const Settings = () => {
  return (
    <div>
      <VideoForm />
    </div>
  );
};

const Profile = () => {
  return <div>Profile</div>;
};
