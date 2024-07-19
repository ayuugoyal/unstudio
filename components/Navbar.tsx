import Link from "next/link";
import React from "react";
import { auth } from "@/auth";
import { Button } from "./ui/button";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Logout from "./Logout";

const Navbar = async () => {
  const session = await auth();
  return (
    <div className="flex w-full justify-end">
      {!session?.user ? (
        <Link href="/sign-in">
          <Button>Log In</Button>
        </Link>
      ) : (
        <div className="flex justify-end gap-3 items-center">
          <div className="flex justify-center gap-3 items-center">
            {session?.user?.image && (
              <Image
                src={session?.user?.image}
                alt="Avatar"
                width={32}
                height={32}
                className="rounded-full"
              />
            )}
            {session?.user?.name}
          </div>
          <Logout />
        </div>
      )}
    </div>
  );
};

export default Navbar;
