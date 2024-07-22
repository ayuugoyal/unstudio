"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { Image, User } from "@prisma/client";
import { getUserData } from "./auth";

export const getUserImages = async () => {
  try {
    const session = await auth();

    console.log("Session:", session);

    if (!session) {
      return { message: "Unauthorized", status: 401 };
    }

    const getUser: any = await getUserData();

    const images: Image[] = await db.image.findMany({
      where: { userId: getUser.id },
    });

    return images;
  } catch (error: any) {
    console.error(error);
    return {
      error: error.message,
    };
  }
};
