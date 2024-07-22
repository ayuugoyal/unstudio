"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { Image } from "@prisma/client";

export const getUserImages = async () => {
  try {
    const session = await auth();

    console.log("Session:", session);

    if (!session) {
      return { message: "Unauthorized", status: 401 };
    }

    const images: Image[] = await db.image.findMany({
      where: { userId: session?.user?.id },
    });

    return images;
  } catch (error: any) {
    console.error(error);
    return {
      error: error.message,
    };
  }
};
