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

    console.log("User:", getUser);

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

export const deleteAnImage = async (id: string) => {
  try {
    const session = await auth();

    if (!session) {
      return { message: "Unauthorized", status: 401 };
    }

    const image: Image = await db.image.delete({
      where: {
        id: id,
      },
    });

    return image;
  } catch (error: any) {
    console.error(error);
    return {
      error: error.message,
    };
  }
};

export const setUserName = async (name: string) => {
  try {
    const session = await auth();

    if (!session) {
      return { message: "Unauthorized", status: 401 };
    }

    const getUser: any = await getUserData();

    const user: User = await db.user.update({
      where: {
        id: getUser.id,
      },
      data: {
        name: name,
      },
    });

    return user;
  } catch (error: any) {
    console.error(error);
    return {
      error: error.message,
    };
  }
};
