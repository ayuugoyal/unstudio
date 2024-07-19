"use client";
import React from "react";
import { Button } from "./ui/button";
import { logout } from "@/actions/auth";
import { LogOut as LogIcon } from "lucide-react";

const Logout = () => {
  return (
    <div>
      <Button onClick={() => logout()}>
        <LogIcon />
        Log Out
      </Button>
    </div>
  );
};

export default Logout;
